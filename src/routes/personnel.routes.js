const router = require("express").Router();
const controller = require("../controllers/personnel.controller");
const { asyncHandler } = require("../utils/http");

const pageRouter = router;
pageRouter.get("/", asyncHandler(controller.getAll));
pageRouter.post("/", asyncHandler(controller.create));
pageRouter.post("/:id", asyncHandler(controller.update));
pageRouter.post("/:id/delete", asyncHandler(controller.remove));

const apiRouter = require("express").Router();
apiRouter.get("/", asyncHandler(controller.getAll));
apiRouter.get("/:id", asyncHandler(controller.getOne));
apiRouter.post("/", asyncHandler(controller.create));
apiRouter.put("/:id", asyncHandler(controller.update));
apiRouter.delete("/:id", asyncHandler(controller.remove));

module.exports = { apiRouter, pageRouter };
