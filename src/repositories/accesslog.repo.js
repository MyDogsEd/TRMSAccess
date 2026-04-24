const { createBaseRepository } = require("./base.repo");

const baseRepo = createBaseRepository("AccessLog");

async function updatePersonnelSummary(personnelId, summary) {
  await baseRepo.collection().updateMany(
    { "personnel._id": personnelId },
    {
      $set: {
        "personnel.name": summary.name,
        "personnel.role": summary.role
      }
    }
  );
}

async function updateContainmentUnitSummary(unitId, summary) {
  await baseRepo.collection().updateMany(
    { "containmentUnit._id": unitId },
    {
      $set: {
        "containmentUnit.location": summary.location,
        "containmentUnit.containmentLevel": summary.containmentLevel
      }
    }
  );
}

async function updateRelicSummary(relicId, summary) {
  await baseRepo.collection().updateMany(
    { "relic._id": relicId },
    {
      $set: {
        "relic.name": summary.name,
        "relic.containmentStatus": summary.containmentStatus
      }
    }
  );
}

module.exports = {
  ...baseRepo,
  updateContainmentUnitSummary,
  updatePersonnelSummary,
  updateRelicSummary
};
