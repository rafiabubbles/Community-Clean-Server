
const { ObjectId } = require("mongodb");

class CategoryCard {
  constructor({ title, coverPhoto, category, downloadLink, description }) {
    this.title = title;
    this.coverPhoto = coverPhoto;
    this.category = category;
    this.downloadLink = downloadLink;
    this.description = description;
    this.createdAt = new Date();
  }
}

module.exports = CategoryCard;
