const accessLogRepo = require("../repositories/accesslog.repo");
const containmentRepo = require("../repositories/containment.repo");
const missionRepo = require("../repositories/mission.repo");
const relicRepo = require("../repositories/relic.repo");
const { createValidationError, validateRelic } = require("../utils/validators");

function toContainmentSummary(unit) {
  return unit
    ? {
        _id: unit._id,
        location: unit.location,
        containmentLevel: unit.containmentLevel
      }
    : null;
}

function toMissionSummary(mission) {
  return mission
    ? {
        _id: mission._id,
        codename: mission.codename,
        status: mission.status
      }
    : null;
}

async function getAll() {
  return relicRepo.findAll({ _id: 1 });
}

async function getById(id) {
  const relic = await relicRepo.findById(id);
  if (!relic) {
    throw createValidationError("Relic record not found.", 404);
  }

  return relic;
}

async function resolveContainmentUnit(unitId) {
  if (!unitId) {
    return null;
  }

  const unit = await containmentRepo.findById(Number(unitId));
  if (!unit) {
    throw createValidationError("Containment unit not found.");
  }

  return toContainmentSummary(unit);
}

async function resolveMission(missionId) {
  if (!missionId) {
    return null;
  }

  const mission = await missionRepo.findById(Number(missionId));
  if (!mission) {
    throw createValidationError("Mission not found.");
  }

  return toMissionSummary(mission);
}

async function create(data) {
  const containmentUnit = await resolveContainmentUnit(data.containmentUnitId);
  const missionSummary = await resolveMission(data.discoveryMissionId);

  const payload = {
    name: data.name,
    description: data.description || null,
    originTimePeriod: data.originTimePeriod || null,
    discovery: {
      location: data.discoveryLocation || null,
      date: data.discoveryDate || null,
      mission: missionSummary
    },
    riskClassification: data.riskClassification,
    containmentStatus: data.containmentStatus,
    containment: {
      unit: containmentUnit,
      date: data.containmentDate || null
    }
  };

  validateRelic(payload);
  return relicRepo.create(payload);
}

async function update(id, data) {
  const existing = await getById(id);
  const containmentUnit =
    data.containmentUnitId !== undefined
      ? await resolveContainmentUnit(data.containmentUnitId)
      : existing.containment?.unit || null;
  const missionSummary =
    data.discoveryMissionId !== undefined
      ? await resolveMission(data.discoveryMissionId)
      : existing.discovery?.mission || null;

  const payload = {
    ...existing,
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    originTimePeriod: data.originTimePeriod ?? existing.originTimePeriod,
    discovery: {
      location: data.discoveryLocation ?? existing.discovery?.location ?? null,
      date: data.discoveryDate ?? existing.discovery?.date ?? null,
      mission: missionSummary
    },
    riskClassification: data.riskClassification ?? existing.riskClassification,
    containmentStatus: data.containmentStatus ?? existing.containmentStatus,
    containment: {
      unit: containmentUnit,
      date: data.containmentDate ?? existing.containment?.date ?? null
    }
  };

  validateRelic(payload);
  const updated = await relicRepo.update(id, payload);

  await accessLogRepo.updateRelicSummary(id, {
    name: updated.name,
    containmentStatus: updated.containmentStatus
  });

  return updated;
}

module.exports = {
  create,
  getAll,
  getById,
  update
};
