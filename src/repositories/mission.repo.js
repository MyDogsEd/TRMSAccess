const { createBaseRepository } = require("./base.repo");

const baseRepo = createBaseRepository("Mission");

async function updateAssignedPersonnel(personnelId, summary) {
  await baseRepo.collection().updateMany(
    { "assignedPersonnel._id": personnelId },
    {
      $set: {
        "assignedPersonnel.$[person].name": summary.name,
        "assignedPersonnel.$[person].role": summary.role
      }
    },
    {
      arrayFilters: [{ "person._id": personnelId }]
    }
  );
}

async function removeAssignedPersonnel(personnelId) {
  await baseRepo.collection().updateMany(
    { "assignedPersonnel._id": personnelId },
    {
      $pull: {
        assignedPersonnel: { _id: personnelId }
      }
    }
  );
}

module.exports = {
  ...baseRepo,
  removeAssignedPersonnel,
  updateAssignedPersonnel
};
