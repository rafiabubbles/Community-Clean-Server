const mongoose = require('mongoose');

const addIssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // image URL
  amount: { type: Number, required: true },
  status: { type: String, default: "ongoing" },
  date: { type: Date, default: Date.now },
  email: { type: String, required: true }, // user email
});

module.exports = mongoose.model('AddIssue', addIssueSchema);
