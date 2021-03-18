"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const categorySchema = new Schema({
  categoryName: String,
  categoryFestivals: [
    {
      type: Schema.Types.ObjectId,
      ref: "Festival",
    },
  ],
});

categorySchema.statics.findByName = function (name) {
  return this.findOne({ categoryName: name });
};

module.exports = Mongoose.model("Category", categorySchema);
