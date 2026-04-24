const { getDB } = require("../config/db");

function createBaseRepository(collectionName) {
  function collection() {
    return getDB().collection(collectionName);
  }

  async function findAll(sort = { _id: 1 }) {
    return collection().find().sort(sort).toArray();
  }

  async function findById(id) {
    return collection().findOne({ _id: id });
  }

  async function getNextId() {
    const [lastItem] = await collection().find().sort({ _id: -1 }).limit(1).toArray();
    return lastItem ? lastItem._id + 1 : 1;
  }

  async function create(document) {
    const nextId = document._id || (await getNextId());
    const record = { ...document, _id: nextId };
    await collection().insertOne(record);
    return record;
  }

  async function update(id, update) {
    await collection().updateOne({ _id: id }, { $set: update });
    return findById(id);
  }

  return {
    collection,
    create,
    findAll,
    findById,
    getNextId,
    update
  };
}

module.exports = { createBaseRepository };
