"use strict";
const Festival = require("../models/festival");
const User = require("../models/user");
const Category = require("../models/category");
const Image = require("../models/image");
const apiKey = process.env.weather_api;
const axios = require("axios");
const ImageStore = require("../utils/image-store");

const Festivals = {
  home: {
    handler: async function (request, h) {
      const categories = await Category.find().lean();
      const festivals = await Festival.findByStatus("pending").lean();
      return h.view("home", {
        title: "Add a festival",
        categories: categories,
        festivals: festivals,
      });
    },
  },
  adminhome: {
    handler: async function (request, h) {
      const categories = await Category.find().lean();
      return h.view("admin-home", {
        title: "Admin Home",
        categories: categories,
      });
    },
  },
  report: {
    handler: async function (request, h) {
      // const festivals = await Festival.find().populate("donor").lean();
      // const festivals = await Festival.find().lean();
      const festivals = await Festival.findByStatus("pending").lean();
      return h.view("report", {
        title: "Festivals added to date",
        festivals: festivals,
      });
    },
  },
  addfest: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;

        // if (Object.keys(file).length > 0) {
        const image = await ImageStore.uploadImage(request.payload.imagefile);
        const newImage = new Image({
          imageURL: image.url,
        });
        await newImage.save();
        // }
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        const newFestival = new Festival({
          name: data.name,
          city: data.city,
          country: data.country,
          description: data.description,
          category: data.category,
          latitude: data.latitude,
          longitude: data.longitude,
          startDate: data.startDate,
          endDate: data.endDate,
          approvalStatus: "pending",
          image: newImage._id,
          addedBy: user._id,
        });
        await newFestival.save();
        return h.redirect("/report");
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  getDetails: {
    handler: async function (request, h) {
      try {
        const id = request.params.id;
        const festival = await Festival.findById(id)
          .populate("addedBy")
          .populate("image")
          .lean();
        const location = festival.city;
        const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
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
        // console.log(report);
        return h.view("festival", {
          title: festival.name,
          festival: festival,
          report: report,
        });
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
  fetchWeather: {
    handler: async function (request, h) {
      let weather = {};
      // const location = document.getElementById("location-id").value;
      const location = "Dublin, Ireland";
      const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      try {
        const response = await axios.get(weatherRequest);
        if (response.status == 200) {
          weather = response.data;

          const report = {
            feelsLike: Math.round(weather.main.feels_like - 273.15),
            clouds: weather.weather[0].description,
            windSpeed: weather.wind.speed,
            windDirection: weather.wind.deg,
            visibility: weather.visibility / 1000,
            humidity: weather.main.humidity,
          };
          console.log(report);
          // renderWeather(report)
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = Festivals;
