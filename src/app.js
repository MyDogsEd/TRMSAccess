const express = require("express");
const path = require("path");
const { pageRouter: indexRoutes, apiRouter: indexApiRoutes } = require("./routes/index.routes");
const { pageRouter: personnelRoutes, apiRouter: personnelApiRoutes } = require("./routes/personnel.routes");
const { pageRouter: missionRoutes, apiRouter: missionApiRoutes } = require("./routes/mission.routes");
const { pageRouter: relicRoutes, apiRouter: relicApiRoutes } = require("./routes/relic.routes");
const {
  pageRouter: containmentRoutes,
  apiRouter: containmentApiRoutes
} = require("./routes/containment.routes");
const { pageRouter: accessLogRoutes, apiRouter: accessLogApiRoutes } = require("./routes/accesslog.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.locals.appName = "TRMS Access";

app.use("/", indexRoutes);
app.use("/personnel", personnelRoutes);
app.use("/missions", missionRoutes);
app.use("/relics", relicRoutes);
app.use("/containment", containmentRoutes);
app.use("/access-logs", accessLogRoutes);

app.use("/api", indexApiRoutes);
app.use("/api/personnel", personnelApiRoutes);
app.use("/api/missions", missionApiRoutes);
app.use("/api/relics", relicApiRoutes);
app.use("/api/containment", containmentApiRoutes);
app.use("/api/access-logs", accessLogApiRoutes);

app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  res.status(404).render("error", {
    title: "Not Found",
    error: {
      message: "The requested page could not be found.",
      statusCode: 404
    }
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const payload = {
    error: error.message || "An unexpected error occurred."
  };

  if (req.originalUrl.startsWith("/api")) {
    res.status(statusCode).json(payload);
    return;
  }

  res.status(statusCode).render("error", {
    title: "Application Error",
    error: {
      message: payload.error,
      statusCode
    }
  });
});

module.exports = app;
