"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const festivalSchema = new Schema({
  name: String,
  city: String,
  country: String,
  description: String,
  category: String,
  image: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  latitude: Number,
  longitude: Number,
  startDate: Date,
  endDate: Date,
  approvalStatus: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

festivalSchema.statics.findByStatus = function (status) {
  return this.find({ approvalStatus: status });
};

module.exports = Mongoose.model("Festival", festivalSchema);
