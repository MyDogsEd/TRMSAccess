const accessLogService = require("../services/accesslog.service");
const containmentService = require("../services/containment.service");
const personnelService = require("../services/personnel.service");
const relicService = require("../services/relic.service");
const { handleRedirect, handleSuccess, parseNumericId } = require("../utils/http");

async function getAll(req, res) {
  const [logs, personnel, units, relics] = await Promise.all([
    accessLogService.getAll(),
    personnelService.getAll(),
    containmentService.getAll(),
    relicService.getAll()
  ]);

  handleSuccess(req, res, "accesslog/index", {
    title: "Access Logs",
    logs,
    personnel,
    relics,
    units
  });
}

async function getOne(req, res) {
  const log = await accessLogService.getById(parseNumericId(req.params.id));
  res.json(log);
}

async function create(req, res) {
  const created = await accessLogService.create(req.body);
  handleRedirect(req, res, "/access-logs", created);
}

module.exports = {
  create,
  getAll,
  getOne
};
