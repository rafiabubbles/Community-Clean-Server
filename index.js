// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// --- Check required env ---
const requiredEnv = ["MONGO_USER", "MONGO_PASS", "CLUSTER", "DB_NAME"];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing required .env values:", missing.join(", "));
  process.exit(1);
}

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB URI ---
const uri = `mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(
  process.env.MONGO_PASS
)}@${process.env.CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log("Mongo URI (masked):", uri.replace(/:(.*)@/, ":***@"));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    const db = client.db(process.env.DB_NAME);

    // --- Collections ---
    const addIssueCollection = db.collection("addIssues");
    const issuesCollection = db.collection("issues");
    const contributionsCollection = db.collection("contributions");
    const bannersCollection = db.collection("banners");
    const usersCollection = db.collection("users");
    const categoryCollection = db.collection("categoryCards");

    // --- Routes ---
    const addIssueRoutes = require("./routes/addIssueRoutes.js");
    addIssueRoutes.init(addIssueCollection);
    app.use("/api/add-issue", addIssueRoutes.router);

    const categoryRoutes = require("./routes/categoryCardRoute.js");
    categoryRoutes.init(categoryCollection);
    app.use("/api/categories", categoryRoutes);

    // --- Health route ---
    app.get("/", (req, res) => {
      res.send("🌟 Smart Server running");
    });

    // --- Issues routes ---
    // GET all issues (with optional limit, search, category, status)
    app.get("/api/issues", async (req, res) => {
      try {
        const { limit, category, status, search } = req.query;
        const query = {};
        if (category) query.category = category;
        if (status) query.status = status;
        if (search) query.title = { $regex: search, $options: "i" };

        let cursor = issuesCollection.find(query).sort({ date: -1 });
        if (limit) cursor = cursor.limit(parseInt(limit, 10));
        const issues = await cursor.toArray();
        res.json(issues);
      } catch (err) {
        console.error("GET /api/issues error:", err);
        res.status(500).json({ message: "Failed to fetch issues", error: err.message });
      }
    });

    // GET single issue by ID
app.get("/api/add-issue/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid issue id" });

        const issue = await addIssueCollection.findOne({ _id: new ObjectId(id) });
        if (!issue) return res.status(404).json({ message: "Issue not found" });

        res.json(issue);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch issue", error: err.message });
    }
});


    // POST create issue
    app.post("/api/issues", async (req, res) => {
      try {
        const issue = { ...req.body, status: req.body.status || "ongoing", date: new Date() };
        const result = await issuesCollection.insertOne(issue);
        res.json({ success: true, data: result.insertedId });
      } catch (err) {
        console.error("POST /api/issues error:", err);
        res.status(500).json({ message: "Failed to create issue", error: err.message });
      }
    });

    // PUT update issue
    app.put("/api/issues/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid issue id" });

        const update = req.body;
        const result = await issuesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: update }
        );
        res.json({ success: true, matched: result.matchedCount, modified: result.modifiedCount });
      } catch (err) {
        console.error("PUT /api/issues/:id error:", err);
        res.status(500).json({ message: "Failed to update issue", error: err.message });
      }
    });

    // DELETE issue
    app.delete("/api/issues/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid issue id" });

        const result = await issuesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Issue not found" });

        res.json({ success: true, deleted: result.deletedCount });
      } catch (err) {
        console.error("DELETE /api/issues/:id error:", err);
        res.status(500).json({ message: "Failed to delete issue", error: err.message });
      }
    });

    // --- Contributions ---
    app.get("/api/contributions", async (req, res) => {
      try {
        const { issueId, email } = req.query;
        const q = {};
        if (issueId) q.issueId = issueId;
        if (email) q.email = email;

        const items = await contributionsCollection.find(q).sort({ date: -1 }).toArray();
        res.json(items);
      } catch (err) {
        console.error("GET /api/contributions error:", err);
        res.status(500).json({ message: "Failed to fetch contributions", error: err.message });
      }
    });

    app.post("/api/contributions", async (req, res) => {
      try {
        const contribution = { ...req.body, date: new Date() };
        const result = await contributionsCollection.insertOne(contribution);
        res.json({ success: true, data: result.insertedId });
      } catch (err) {
        console.error("POST /api/contributions error:", err);
        res.status(500).json({ message: "Failed to create contribution", error: err.message });
      }
    });

    // --- Banners ---
    app.get("/api/banners", async (req, res) => {
      try {
        const banners = await bannersCollection.find().sort({ _id: 1 }).toArray();
        res.json(banners);
      } catch (err) {
        console.error("GET /api/banners error:", err);
        res.status(500).json({ message: "Failed to fetch banners", error: err.message });
      }
    });

    app.post("/api/banners", async (req, res) => {
      try {
        const banner = { ...req.body, createdAt: new Date() };
        const result = await bannersCollection.insertOne(banner);
        res.json({ success: true, id: result.insertedId });
      } catch (err) {
        console.error("POST /api/banners error:", err);
        res.status(500).json({ message: "Failed to create banner", error: err.message });
      }
    });

    // --- Stats ---
    app.get("/api/stats", async (req, res) => {
      try {
        const totalUsers = await usersCollection.countDocuments();
        const resolved = await issuesCollection.countDocuments({ status: "resolved" });
        const pending = await issuesCollection.countDocuments({ status: "ongoing" });
        res.json({ totalUsers, resolved, pending });
      } catch (err) {
        console.error("GET /api/stats error:", err);
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
      }
    });

    // --- Start server ---
    const server = app.listen(port, () => {
      console.log(`🚀 Smart server running on port ${port}`);
    });

    // --- Graceful shutdown ---
    const shutdown = async () => {
      console.log("Shutting down server...");
      try {
        await client.close();
        server.close(() => {
          console.log("Server closed");
          process.exit(0);
        });
      } catch (e) {
        console.error("Error during shutdown", e);
        process.exit(1);
      }
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    proess.exit(1);
  }
})();
