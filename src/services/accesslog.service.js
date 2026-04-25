const accessLogRepo = require("../repositories/accesslog.repo");
const containmentRepo = require("../repositories/containment.repo");
const personnelRepo = require("../repositories/personnel.repo");
const relicRepo = require("../repositories/relic.repo");
const {
  createValidationError,
  hasRequiredAccess,
  validateAccessLog
} = require("../utils/validators");

function toPersonnelSummary(person) {
  return {
    _id: person._id,
    name: person.name,
    role: person.role
  };
}

function toContainmentSummary(unit) {
  return {
    _id: unit._id,
    location: unit.location,
    containmentLevel: unit.containmentLevel
  };
}

function toRelicSummary(relic) {
  return {
    _id: relic._id,
    name: relic.name,
    containmentStatus: relic.containmentStatus
  };
}

async function getAll() {
  return accessLogRepo.findAll({ accessTime: -1, _id: 1 });
}

async function getById(id) {
  const log = await accessLogRepo.findById(id);
  if (!log) {
    throw createValidationError("Access log not found.", 404);
  }

  return log;
}

async function create(data) {
  const personnel = await personnelRepo.findById(Number(data.personnelId));
  const containmentUnit = await containmentRepo.findById(Number(data.containmentUnitId));
  const relic = await relicRepo.findById(Number(data.relicId));

  if (!personnel || !containmentUnit || !relic) {
    throw createValidationError("Personnel, containment unit, and relic must all exist.");
  }

  if (!hasRequiredAccess(personnel.role, containmentUnit.accessLevel)) {
    throw createValidationError(
      `Role ${personnel.role} does not meet required access level ${containmentUnit.accessLevel}.`,
      403
    );
  }

  const payload = {
    personnel: toPersonnelSummary(personnel),
    containmentUnit: toContainmentSummary(containmentUnit),
    relic: toRelicSummary(relic),
    accessTime: data.accessTime ? new Date(data.accessTime).toISOString() : new Date().toISOString(),
    reason: data.reason
  };

  validateAccessLog(payload);
  return accessLogRepo.create(payload);
}

async function update(id, data) {
  const existing = await getById(id);
  const personnelId = data.personnelId ?? existing.personnel?._id;
  const containmentUnitId = data.containmentUnitId ?? existing.containmentUnit?._id;
  const relicId = data.relicId ?? existing.relic?._id;

  const personnel = await personnelRepo.findById(Number(personnelId));
  const containmentUnit = await containmentRepo.findById(Number(containmentUnitId));
  const relic = await relicRepo.findById(Number(relicId));

  if (!personnel || !containmentUnit || !relic) {
    throw createValidationError("Personnel, containment unit, and relic must all exist.");
  }

  if (!hasRequiredAccess(personnel.role, containmentUnit.accessLevel)) {
    throw createValidationError(
      `Role ${personnel.role} does not meet required access level ${containmentUnit.accessLevel}.`,
      403
    );
  }

  const payload = {
    ...existing,
    personnel: toPersonnelSummary(personnel),
    containmentUnit: toContainmentSummary(containmentUnit),
    relic: toRelicSummary(relic),
    accessTime: data.accessTime
      ? new Date(data.accessTime).toISOString()
      : existing.accessTime,
    reason: data.reason ?? existing.reason
  };

  validateAccessLog(payload);
  return accessLogRepo.update(id, payload);
}

async function remove(id) {
  const existing = await getById(id);
  await accessLogRepo.remove(id);

  return existing;
}

module.exports = {
  create,
  getAll,
  getById,
  remove,
  update
};
