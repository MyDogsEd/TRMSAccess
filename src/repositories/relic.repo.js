const { createBaseRepository } = require("./base.repo");

const baseRepo = createBaseRepository("Relic");

async function updateDiscoveryMissionSummary(missionId, missionSummary) {
  await baseRepo.collection().updateMany(
    { "discovery.mission._id": missionId },
    {
      $set: {
        "discovery.mission.codename": missionSummary.codename,
        "discovery.mission.status": missionSummary.status
      }
    }
  );
}

async function updateContainmentUnitSummary(unitId, unitSummary) {
  await baseRepo.collection().updateMany(
    { "containment.unit._id": unitId },
    {
      $set: {
        "containment.unit.location": unitSummary.location,
        "containment.unit.containmentLevel": unitSummary.containmentLevel
      }
    }
  );
}

module.exports = {
  ...baseRepo,
  updateContainmentUnitSummary,
  updateDiscoveryMissionSummary
};
