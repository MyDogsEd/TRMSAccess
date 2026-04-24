const pageRouter = require("express").Router();
const apiRouter = require("express").Router();
const personnelService = require("../services/personnel.service");
const missionService = require("../services/mission.service");
const relicService = require("../services/relic.service");
const containmentService = require("../services/containment.service");
const accessLogService = require("../services/accesslog.service");
const { asyncHandler } = require("../utils/http");

pageRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const [personnel, missions, relics, containmentUnits, accessLogs] = await Promise.all([
      personnelService.getAll(),
      missionService.getAll(),
      relicService.getAll(),
      containmentService.getAll(),
      accessLogService.getAll()
    ]);

    res.render("index", {
      title: "TRMS Dashboard",
      stats: {
        personnel: personnel.length,
        missions: missions.length,
        relics: relics.length,
        containmentUnits: containmentUnits.length,
        accessLogs: accessLogs.length
      },
      recentMissions: missions.slice(0, 5),
      recentRelics: relics.slice(0, 5),
      recentLogs: accessLogs.slice(0, 5)
    });
  })
);

apiRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json({
      ok: true,
      service: "TRMSAccess API"
    });
  })
);

module.exports = { apiRouter, pageRouter };
