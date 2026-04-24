db = db.getSiblingDB("trms");

function loadSeed(path) {
  return JSON.parse(cat(path));
}

function seedCollection(name, path) {
  const collection = db.getCollection(name);
  if (collection.countDocuments() > 0) {
    return;
  }

  const documents = loadSeed(path);
  if (documents.length > 0) {
    collection.insertMany(documents);
  }
}

seedCollection("Personnel", "/seed-data/TRMS.Personnel.json");
seedCollection("Mission", "/seed-data/TRMS.Mission.json");
seedCollection("ContainmentUnit", "/seed-data/TRMS.ContainmentUnit.json");
seedCollection("Relic", "/seed-data/TRMS.Relic.json");
seedCollection("AccessLog", "/seed-data/TRMS.AccessLog.json");
