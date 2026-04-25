const missionRepo = require("../repositories/mission.repo");
const personnelRepo = require("../repositories/personnel.repo");
const accessLogRepo = require("../repositories/accesslog.repo");
const { createValidationError, validatePersonnel } = require("../utils/validators");

async function getAll() {
  return personnelRepo.findAll({ role: 1, name: 1 });
}

async function getById(id) {
  const personnel = await personnelRepo.findById(id);
  if (!personnel) {
    throw createValidationError("Personnel record not found.", 404);
  }

  return personnel;
}

async function create(data) {
  const payload = {
    name: data.name,
    role: data.role,
    specialization: data.specialization || null
  };

  validatePersonnel(payload);
  return personnelRepo.create(payload);
}

async function update(id, data) {
  const existing = await getById(id);
  const payload = {
    ...existing,
    name: data.name ?? existing.name,
    role: data.role ?? existing.role,
    specialization: data.specialization ?? existing.specialization
  };

  validatePersonnel(payload);

  const updated = await personnelRepo.update(id, payload);
  const summary = {
    _id: updated._id,
    name: updated.name,
    role: updated.role
  };

  await missionRepo.updateAssignedPersonnel(id, summary);
  await accessLogRepo.updatePersonnelSummary(id, summary);

  return updated;
}

async function remove(id) {
  const existing = await getById(id);
  await personnelRepo.remove(id);
  await missionRepo.removeAssignedPersonnel(id);

  return existing;
}

module.exports = {
  create,
  getAll,
  getById,
  remove,
  update
};
