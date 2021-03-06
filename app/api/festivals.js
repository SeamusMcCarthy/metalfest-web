"use strict";

const Festival = require("../models/festival");
const Category = require("../models/category");
const Boom = require("@hapi/boom");
const ImageStore = require("../utils/image-store");
const Image = require("../models/image");
const Joi = require("@hapi/joi");
const axios = require("axios");
const apiKey = process.env.weather_api;
const sanitize = require("sanitize-html");

const Festivals = {
  find: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const festivals = await Festival.find();
      return festivals;
    },
  },
  findOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      try {
        const festival = await Festival.findOne({ _id: request.params.id })
          .populate("attendees")
          .populate("image")
          .lean();
        if (!festival) {
          return Boom.notFound("No festival with this id");
        }
        return festival;
      } catch (err) {
        return Boom.notFound("No festival with this id");
      }
    },
  },
  create: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const data = request.payload;
      // const newFestival = new Festival(request.payload);
      const newFestival = new Festival({
        name: sanitize(data.name),
        city: sanitize(data.city),
        country: sanitize(data.country),
        description: sanitize(data.description),
        latitude: sanitize(data.latitude),
        longitude: sanitize(data.longitude),
        approvalStatus: sanitize(data.approvalStatus),
      });
      const festival = await newFestival.save();
      if (festival) {
        return h.response(festival).code(201);
      }
      return Boom.badImplementation("error creating festival");
    },
  },

  create2: {
    auth: { strategy: "jwt" },
    validate: {
      payload: {
        name: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        description: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
      },
      options: {
        abortEarly: false,
        allowUnknown: true,
      },
      failAction: function (request, h, error) {
        return {
          success: false,
        };
      },
    },
    handler: async function (request, h) {
      try {
        let img = request.payload.imagefile;
        const image = await ImageStore.uploadImage(img);
        const newImage = new Image({
          imageURL: image.url,
        });
        await newImage.save();

        const data = request.payload;
        let festExists = await Festival.findByName(data.name);
        if (festExists.length > 0) {
          const message = "Festival already exists";
          throw Boom.unauthorized(message);
        }
        if (data.endDate < data.startDate) {
          const message = "Festival end date is before start date";
          throw Boom.unauthorized(message);
        }
        const newFestival = new Festival({
          name: sanitize(data.name),
          city: sanitize(data.city),
          country: sanitize(data.country),
          description: sanitize(data.description),
          latitude: data.latitude,
          longitude: data.longitude,
          startDate: data.startDate,
          endDate: data.endDate,
          approvalStatus: "pending",
          image: newImage._id,
          attendees: [],
        });
        await newFestival.save();

        if (typeof data.categoryList == "string") {
          const catID = await Category.findByName(data.categoryList);
          catID.categoryFestivals.push(newFestival._id);
          await catID.save();
        } else {
          for (const cat of data.categoryList) {
            const catID = await Category.findByName(cat);
            catID.categoryFestivals.push(newFestival._id);
            await catID.save();
          }
        }
        console.log("About to return true");
        return { success: true };
      } catch (err) {
        console.log("About to return false");
        return { success: false };
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  getWeather: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?q=${request.params.location}&appid=${apiKey}`;
      let weather = {};
      const response = await axios.get(weatherRequest);
      if (response.status == 200) {
        weather = response.data;
      }
      const report = {
        feelsLike: Math.round(weather.main.feels_like - 273.15),
        clouds: weather.weather[0].description,
        windSpeed: weather.wind.speed,
        windDirection: weather.wind.deg,
        visibility: weather.visibility / 1000,
        humidity: weather.main.humidity,
      };

      return report;
    },
  },

  deleteAll: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      await Festival.deleteMany({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const response = await Festival.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  updateAttendance: {
    auth: { strategy: "jwt" },
    handler: async function (request, h) {
      const festID = sanitize(request.params.festid);
      const userID = sanitize(request.params.userid);
      const fest = await Festival.findById(festID);
      fest.attendees.push(userID);
      fest.save();
      if (fest) {
        return { success: true };
      }
    },
  },
};

module.exports = Festivals;
