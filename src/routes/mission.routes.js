const pageRouter = require("express").Router();
const apiRouter = require("express").Router();
const controller = require("../controllers/mission.controller");
const { asyncHandler } = require("../utils/http");

pageRouter.get("/", asyncHandler(controller.getAll));
pageRouter.post("/", asyncHandler(controller.create));
pageRouter.post("/:id", asyncHandler(controller.update));

apiRouter.get("/", asyncHandler(controller.getAll));
apiRouter.get("/:id", asyncHandler(controller.getOne));
apiRouter.post("/", asyncHandler(controller.create));
apiRouter.put("/:id", asyncHandler(controller.update));

module.exports = { apiRouter, pageRouter };
