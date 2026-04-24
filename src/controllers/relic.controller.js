const containmentService = require("../services/containment.service");
const missionService = require("../services/mission.service");
const relicService = require("../services/relic.service");
const { CONTAINMENT_STATUS, RISK_CLASSIFICATIONS } = require("../utils/enums");
const { handleRedirect, handleSuccess, parseNumericId } = require("../utils/http");

async function getAll(req, res) {
  const [relics, missions, units] = await Promise.all([
    relicService.getAll(),
    missionService.getAll(),
    containmentService.getAll()
  ]);

  handleSuccess(req, res, "relic/index", {
    title: "Relics",
    containmentStatuses: CONTAINMENT_STATUS,
    missions,
    relics,
    riskClassifications: RISK_CLASSIFICATIONS,
    units
  });
}

async function getOne(req, res) {
  const relic = await relicService.getById(parseNumericId(req.params.id));
  res.json(relic);
}

async function create(req, res) {
  const created = await relicService.create(req.body);
  handleRedirect(req, res, "/relics", created);
}

async function update(req, res) {
  const updated = await relicService.update(parseNumericId(req.params.id), req.body);
  handleRedirect(req, res, "/relics", updated, 200);
}

module.exports = {
  create,
  getAll,
  getOne,
  update
};
