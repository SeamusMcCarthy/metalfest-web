"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const imageSchema = new Schema({
  imageURL: String,
});

module.exports = Mongoose.model("Image", imageSchema);
