const missionService = require("../services/mission.service");
const personnelService = require("../services/personnel.service");
const { MISSION_OUTCOMES, MISSION_STATUS } = require("../utils/enums");
const { handleRedirect, handleSuccess, parseNumericId } = require("../utils/http");

async function getAll(req, res) {
  const [missions, personnel] = await Promise.all([
    missionService.getAll(),
    personnelService.getAll()
  ]);

  handleSuccess(req, res, "mission/index", {
    title: "Missions",
    missions,
    outcomes: MISSION_OUTCOMES,
    personnel,
    statuses: MISSION_STATUS
  });
}

async function getOne(req, res) {
  const mission = await missionService.getById(parseNumericId(req.params.id));
  res.json(mission);
}

async function create(req, res) {
  const created = await missionService.create(req.body);
  handleRedirect(req, res, "/missions", created);
}

async function update(req, res) {
  const updated = await missionService.update(parseNumericId(req.params.id), req.body);
  handleRedirect(req, res, "/missions", updated, 200);
}

module.exports = {
  create,
  getAll,
  getOne,
  update
};
