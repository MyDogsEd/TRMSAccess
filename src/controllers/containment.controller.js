const containmentService = require("../services/containment.service");
const { ACCESS_LEVELS, RISK_CLASSIFICATIONS } = require("../utils/enums");
const { handleRedirect, handleSuccess, parseNumericId } = require("../utils/http");

async function getAll(req, res) {
  const units = await containmentService.getAll();
  handleSuccess(req, res, "containment/index", {
    title: "Containment Units",
    accessLevels: ACCESS_LEVELS,
    containmentLevels: RISK_CLASSIFICATIONS,
    units
  });
}

async function getOne(req, res) {
  const unit = await containmentService.getById(parseNumericId(req.params.id));
  res.json(unit);
}

async function create(req, res) {
  const created = await containmentService.create(req.body);
  handleRedirect(req, res, "/containment", created);
}

async function update(req, res) {
  const updated = await containmentService.update(parseNumericId(req.params.id), req.body);
  handleRedirect(req, res, "/containment", updated, 200);
}

module.exports = {
  create,
  getAll,
  getOne,
  update
};
