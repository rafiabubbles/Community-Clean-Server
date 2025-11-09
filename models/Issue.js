const { ObjectId } = require("mongodb");

function IssueModel(db) {
  const collection = db.collection("issues");

  return {
    getAll: async (filter = {}, limit = 0) => {
      let cursor = collection.find(filter).sort({ date: -1 });
      if (limit) cursor = cursor.limit(limit);
      return cursor.toArray();
    },

    getById: async (id) => {
      return collection.findOne({ _id: new ObjectId(id) });
    },

    create: async (issue) => {
      issue.status = "ongoing";
      issue.date = new Date();
      const result = await collection.insertOne(issue);
      return result;
    },

    update: async (id, data) => {
      return collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
    },

    delete: async (id) => {
      return collection.deleteOne({ _id: new ObjectId(id) });
    },
  };
}

module.exports = IssueModel;
