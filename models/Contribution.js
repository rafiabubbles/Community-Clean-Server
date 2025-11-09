const { ObjectId } = require("mongodb");

function ContributionModel(db) {
  const collection = db.collection("contributions");

  return {
    getAll: async (filter = {}) => {
      return collection.find(filter).sort({ date: -1 }).toArray();
    },

    create: async (contribution) => {
      contribution.date = new Date();
      const result = await collection.insertOne(contribution);
      return result;
    },
  };
}

module.exports = ContributionModel;
