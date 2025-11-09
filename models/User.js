const { ObjectId } = require("mongodb");

function UserModel(db) {
  const collection = db.collection("users");

  return {
    getAll: async () => {
      return collection.find().toArray();
    },

    getById: async (id) => {
      return collection.findOne({ _id: new ObjectId(id) });
    },

    create: async (user) => {
      const result = await collection.insertOne(user);
      return result;
    },

    getByEmail: async (email) => {
      return collection.findOne({ email });
    },
  };
}

module.exports = UserModel;
