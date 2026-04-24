const accessLogRepo = require("../repositories/accesslog.repo");
const containmentRepo = require("../repositories/containment.repo");
const relicRepo = require("../repositories/relic.repo");
const { createValidationError, validateContainmentUnit } = require("../utils/validators");

async function getAll() {
  return containmentRepo.findAll({ containmentLevel: 1, location: 1 });
}

async function getById(id) {
  const unit = await containmentRepo.findById(id);
  if (!unit) {
    throw createValidationError("Containment unit not found.", 404);
  }

  return unit;
}

async function create(data) {
  const payload = {
    location: data.location,
    accessLevel: data.accessLevel,
    containmentLevel: data.containmentLevel
  };

  validateContainmentUnit(payload);
  return containmentRepo.create(payload);
}

async function update(id, data) {
  const existing = await getById(id);
  const payload = {
    ...existing,
    location: data.location ?? existing.location,
    accessLevel: data.accessLevel ?? existing.accessLevel,
    containmentLevel: data.containmentLevel ?? existing.containmentLevel
  };

  validateContainmentUnit(payload);
  const updated = await containmentRepo.update(id, payload);
  const summary = {
    location: updated.location,
    containmentLevel: updated.containmentLevel
  };

  await relicRepo.updateContainmentUnitSummary(id, summary);
  await accessLogRepo.updateContainmentUnitSummary(id, summary);

  return updated;
}

module.exports = {
  create,
  getAll,
  getById,
  update
};
