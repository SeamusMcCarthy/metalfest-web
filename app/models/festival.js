"use strict";

const Boom = require("@hapi/boom");
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
  userImages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
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

festivalSchema.statics.findByName = function (festName) {
  return this.find({ name: festName });
};

festivalSchema.methods.checkAttendance = function (userID) {
  if (this.attendees.includes(userID)) {
    throw Boom.unauthorized("Already listed as attended");
  }
  return this;
};

module.exports = Mongoose.model("Festival", festivalSchema);
