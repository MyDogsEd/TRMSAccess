const personnelService = require("../services/personnel.service");
const { handleRedirect, handleSuccess, parseNumericId } = require("../utils/http");
const { PERSONNEL_ROLES } = require("../utils/enums");

async function getAll(req, res) {
  const personnel = await personnelService.getAll();
  handleSuccess(req, res, "personnel/index", {
    title: "Personnel",
    personnel,
    roles: PERSONNEL_ROLES
  });
}

async function getOne(req, res) {
  const person = await personnelService.getById(parseNumericId(req.params.id));
  res.json(person);
}

async function create(req, res) {
  const created = await personnelService.create(req.body);
  handleRedirect(req, res, "/personnel", created);
}

async function update(req, res) {
  const updated = await personnelService.update(parseNumericId(req.params.id), req.body);
  handleRedirect(req, res, "/personnel", updated, 200);
}

async function remove(req, res) {
  const removed = await personnelService.remove(parseNumericId(req.params.id));
  handleRedirect(req, res, "/personnel", removed, 200);
}

module.exports = {
  create,
  getAll,
  getOne,
  remove,
  update
};
