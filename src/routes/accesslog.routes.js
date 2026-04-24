const pageRouter = require("express").Router();
const apiRouter = require("express").Router();
const controller = require("../controllers/accesslog.controller");
const { asyncHandler } = require("../utils/http");

pageRouter.get("/", asyncHandler(controller.getAll));
pageRouter.post("/", asyncHandler(controller.create));

apiRouter.get("/", asyncHandler(controller.getAll));
apiRouter.get("/:id", asyncHandler(controller.getOne));
apiRouter.post("/", asyncHandler(controller.create));

module.exports = { apiRouter, pageRouter };
