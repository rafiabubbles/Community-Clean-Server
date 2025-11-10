import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: String,
  coverPhoto: String,
  category: String,
  downloadLink: String,
  description: String,
});

export default mongoose.model("Banne", bannerSchema);
