const {
  ACCESS_LEVELS,
  CONTAINMENT_STATUS,
  MISSION_OUTCOMES,
  MISSION_STATUS,
  PERSONNEL_ROLES,
  RISK_CLASSIFICATIONS,
  ROLE_PRIORITY
} = require("./enums");

function createValidationError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function assertRequired(value, message) {
  if (value === undefined || value === null || value === "") {
    throw createValidationError(message);
  }
}

function assertInSet(value, allowed, message) {
  if (value !== undefined && value !== null && !allowed.includes(value)) {
    throw createValidationError(message);
  }
}

function validatePersonnel(personnel) {
  assertRequired(personnel.name, "Personnel name is required.");
  assertRequired(personnel.role, "Personnel role is required.");
  assertInSet(personnel.role, PERSONNEL_ROLES, "Invalid personnel role.");
}

function validateMission(mission) {
  assertRequired(mission.codename, "Mission codename is required.");
  assertRequired(mission.objective, "Mission objective is required.");
  assertRequired(mission.status, "Mission status is required.");
  assertInSet(mission.status, MISSION_STATUS, "Invalid mission status.");
  assertInSet(mission.outcome, MISSION_OUTCOMES, "Invalid mission outcome.");

  if (mission.status === "COMPLETE" && !mission.outcome) {
    throw createValidationError("Mission outcome is required when status is COMPLETE.");
  }
}

function validateContainmentUnit(unit) {
  assertRequired(unit.location, "Containment unit location is required.");
  assertRequired(unit.accessLevel, "Containment unit access level is required.");
  assertRequired(unit.containmentLevel, "Containment level is required.");
  assertInSet(unit.accessLevel, ACCESS_LEVELS, "Invalid containment access level.");
  assertInSet(unit.containmentLevel, RISK_CLASSIFICATIONS, "Invalid containment level.");
}

function validateRelic(relic) {
  assertRequired(relic.name, "Relic name is required.");
  assertRequired(relic.riskClassification, "Risk classification is required.");
  assertRequired(relic.containmentStatus, "Containment status is required.");
  assertInSet(relic.riskClassification, RISK_CLASSIFICATIONS, "Invalid risk classification.");
  assertInSet(relic.containmentStatus, CONTAINMENT_STATUS, "Invalid containment status.");

  if (relic.containmentStatus === "CONTAINED" && !relic.containment?.unit) {
    throw createValidationError("Contained relics must reference a containment unit.");
  }
}

function validateAccessLog(accessLog) {
  assertRequired(accessLog.personnel?._id, "Access log personnel is required.");
  assertRequired(accessLog.containmentUnit?._id, "Access log containment unit is required.");
  assertRequired(accessLog.relic?._id, "Access log relic is required.");
  assertRequired(accessLog.reason, "Access log reason is required.");
}

function hasRequiredAccess(userRole, requiredRole) {
  return (ROLE_PRIORITY[userRole] || 0) >= (ROLE_PRIORITY[requiredRole] || 0);
}

module.exports = {
  createValidationError,
  hasRequiredAccess,
  validateAccessLog,
  validateContainmentUnit,
  validateMission,
  validatePersonnel,
  validateRelic
};
