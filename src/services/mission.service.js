const missionRepo = require("../repositories/mission.repo");
const relicRepo = require("../repositories/relic.repo");
const personnelRepo = require("../repositories/personnel.repo");
const { createValidationError, validateMission } = require("../utils/validators");

function toPersonnelSummary(person) {
  return {
    _id: person._id,
    name: person.name,
    role: person.role
  };
}

function normalizeArray(value) {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

async function resolvePersonnelAssignments(assignedPersonnelIds = []) {
  const uniqueIds = [...new Set(normalizeArray(assignedPersonnelIds).map(Number).filter(Boolean))];
  const personnel = await Promise.all(uniqueIds.map((id) => personnelRepo.findById(id)));

  if (personnel.some((entry) => !entry)) {
    throw createValidationError("One or more assigned personnel records were not found.");
  }

  return personnel.map(toPersonnelSummary);
}

async function getAll() {
  return missionRepo.findAll({ missionDate: -1, _id: 1 });
}

async function getById(id) {
  const mission = await missionRepo.findById(id);
  if (!mission) {
    throw createValidationError("Mission record not found.", 404);
  }

  return mission;
}

async function create(data) {
  const payload = {
    missionDate: data.missionDate || null,
    codename: data.codename,
    objective: data.objective,
    outcome: data.outcome || null,
    status: data.status,
    location: data.location || null,
    assignedPersonnel: await resolvePersonnelAssignments(data.assignedPersonnelIds)
  };

  validateMission(payload);
  return missionRepo.create(payload);
}

async function update(id, data) {
  const existing = await getById(id);
  const payload = {
    ...existing,
    missionDate: data.missionDate ?? existing.missionDate,
    codename: data.codename ?? existing.codename,
    objective: data.objective ?? existing.objective,
    outcome: data.outcome !== undefined ? data.outcome || null : existing.outcome,
    status: data.status ?? existing.status,
    location: data.location ?? existing.location,
    assignedPersonnel: data.assignedPersonnelIds
      ? await resolvePersonnelAssignments(data.assignedPersonnelIds)
      : existing.assignedPersonnel
  };

  validateMission(payload);
  const updated = await missionRepo.update(id, payload);

  await relicRepo.updateDiscoveryMissionSummary(id, {
    codename: updated.codename,
    status: updated.status
  });

  return updated;
}

module.exports = {
  create,
  getAll,
  getById,
  resolvePersonnelAssignments,
  update
};
