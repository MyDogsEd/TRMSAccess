const app = require("./app");
const env = require("./config/env");
const { closeDB, connectDB } = require("./config/db");

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`TRMS Access running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start TRMS Access:", error);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});
