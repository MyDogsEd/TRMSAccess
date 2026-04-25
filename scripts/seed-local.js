const fs = require("fs");
const path = require("path");
const { connectDB, closeDB } = require("../src/config/db");

const seeds = [
  ["Personnel", "TRMS.Personnel.json"],
  ["Mission", "TRMS.Mission.json"],
  ["ContainmentUnit", "TRMS.ContainmentUnit.json"],
  ["Relic", "TRMS.Relic.json"],
  ["AccessLog", "TRMS.AccessLog.json"]
];

async function run() {
  const db = await connectDB();
  const seedRoot = path.resolve(__dirname, "../sample-data");

  for (const [collectionName, filename] of seeds) {
    const collection = db.collection(collectionName);
    const count = await collection.countDocuments();
    if (count > 0) {
      continue;
    }

    const content = fs.readFileSync(path.join(seedRoot, filename), "utf8");
    const docs = JSON.parse(content.replace(/^\uFEFF/, "")); // evil black magic!? .replace otherwise invalid
    if (docs.length > 0) {
      await collection.insertMany(docs);
    }
  }
}

run()
  .then(async () => {
    console.log("Local seed completed.");
    await closeDB();
  })
  .catch(async (error) => {
    if (error.cause?.cause?.hostname === "mongo" || error.cause?.hostname === "mongo") {
      console.error(
        "Local seed failed: the hostname 'mongo' only resolves inside Docker Compose. " +
          "For local runs, set MONGO_URI=mongodb://localhost:27017 in .env, or start the full stack with docker compose up --build."
      );
    }

    console.error("Local seed failed:", error);
    await closeDB();
    process.exit(1);
  });
