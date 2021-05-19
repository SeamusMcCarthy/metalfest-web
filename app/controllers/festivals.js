"use strict";
const Festival = require("../models/festival");
const User = require("../models/user");
const Category = require("../models/category");
const Image = require("../models/image");
const apiKey = process.env.weather_api;
const axios = require("axios");
const ImageStore = require("../utils/image-store");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

const Festivals = {
  home: {
    handler: async function (request, h) {
      try {
        const categories = await Category.find()
          .populate("categoryFestivals")
          .lean();
        const festivals = await Festival.find().lean();
        return h.view("home", {
          title: "Add a festival",
          categories: categories,
          festivals: festivals,
        });
      } catch (err) {
        const categories = await Category.find()
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  adminhome: {
    handler: async function (request, h) {
      try {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        const users = await User.find().populate("attended").lean();
        const userCount = await User.find().countDocuments();
        const festCount = await Festival.find().countDocuments();
        const genreCount = await Category.find().countDocuments();
        const festivals = await Festival.find().lean();
        return h.view("admin-home", {
          title: "Admin Home",
          categories: categories,
          users: users,
          usercount: userCount,
          festcount: festCount,
          genrecount: genreCount,
          festivals: festivals,
        });
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  report: {
    handler: async function (request, h) {
      try {
        const festivals = await Festival.find().lean();
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("report", {
          title: "Festivals added to date",
          festivals: festivals,
          categories: categories,
        });
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },

  addfest: {
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
        return h
          .view("main", {
            title: "Error adding festival",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        console.log(request.payload.imagefile);
        const image = await ImageStore.uploadImage(request.payload.imagefile);
        const newImage = new Image({
          imageURL: image.url,
        });
        await newImage.save();

        const id = request.auth.credentials.id;
        const user = await User.findById(id);
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
          name: data.name,
          city: data.city,
          country: data.country,
          description: data.description,
          latitude: data.latitude,
          longitude: data.longitude,
          startDate: data.startDate,
          endDate: data.endDate,
          approvalStatus: "pending",
          image: newImage._id,
          addedBy: user._id,
          attendees: [],
        });
        await newFestival.save();

        if (typeof data.category == "string") {
          const catID = await Category.findByName(data.category);
          catID.categoryFestivals.push(newFestival._id);
          await catID.save();
        } else {
          for (const cat of data.category) {
            const catID = await Category.findByName(cat);
            catID.categoryFestivals.push(newFestival._id);
            await catID.save();
          }
        }
        return h.redirect("/report");
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  showFestival: {
    handler: async function (request, h) {
      try {
        const userID = request.auth.credentials.id;
        const id = request.params.id;
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        const festival = await Festival.findById(id)
          .populate("image")
          .populate("addedBy")
          .populate("attendees")
          .lean();
        const calendarSDate = new Date(festival.startDate)
          .toISOString()
          .split("T");
        const calendarEDate = new Date(festival.endDate)
          .toISOString()
          .split("T");

        return h.view("edit", {
          title: "Festival Details",
          festival: festival,
          categories: categories,
          calendarSDate: calendarSDate[0],
          calendarEDate: calendarEDate[0],
        });
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  editFestival: {
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
        return h
          .view("main", {
            title: "Error adding festival",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        // const image = await ImageStore.uploadImage(
        //   request.payload.imagefile,
        //   request.payload.name
        // );
        // const newImage = new Image({
        //   imageURL: image.url,
        // });
        // await newImage.save();
        const festEdit = request.payload;

        if (festEdit.endDate < festEdit.startDate) {
          const message = "Festival end date is before start date";
          throw Boom.unauthorized(message);
        }

        const id = request.params.id;
        const fest = await Festival.findById(id);
        fest.name = festEdit.name;
        fest.city = festEdit.city;
        fest.country = festEdit.country;
        fest.description = festEdit.description;
        fest.startDate = festEdit.startDate;
        fest.endDate = festEdit.endDate;
        if (Object.keys(file).length > 0) {
          const image = await ImageStore.uploadImage(
            request.payload.imagefile,
            request.payload.name
          );
          const newImage = new Image({
            imageURL: image.url,
          });
          await newImage.save();
          fest.image = newImage._id;
        }
        fest.latitude = festEdit.latitude;
        fest.longitude = festEdit.longitude;
        await fest.save();

        for await (const doc of Category.find()) {
          doc.categoryFestivals.pull(fest._id);
          doc.save();
        }

        if (typeof festEdit.category == "string") {
          const catID = await Category.findByName(festEdit.category);
          catID.categoryFestivals.push(fest._id);
          await catID.save();
        } else {
          for (const cat of festEdit.category) {
            const catID = await Category.findByName(cat);
            catID.categoryFestivals.push(fest._id);
            await catID.save();
          }
        }

        return h.redirect("/select-home");
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  deleteFestival: {
    handler: async function (request, h) {
      try {
        const festID = request.params.id;
        // for await (const doc of User.find()) {
        //   doc.attended.pull(festID);
        //   doc.save();
        // }
        for await (const doc of Category.find()) {
          doc.categoryFestivals.pull(festID);
        }
        await Festival.deleteOne({ _id: festID });
        return h.redirect("/home");
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  attendedFestival: {
    handler: async function (request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const festID = request.params.id;
        const fest = await Festival.findById(festID);
        fest.checkAttendance(id);
        fest.attendees.push(user._id);
        fest.save();
        // user.attended.push(fest._id);
        // user.save();

        return h.redirect("/report");
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  getDetails: {
    handler: async function (request, h) {
      try {
        const userID = request.auth.credentials.id;
        const user = await User.findById(userID);
        const id = request.params.id;
        const fest = await Festival.findById(id);
        let attendance = "";
        if (fest.attendees.includes(user._id)) {
          attendance = "Y";
        }
        const festival = await Festival.findById(id)
          .populate("addedBy")
          .populate("image")
          .populate("attendees")
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
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        const images = await ImageStore.getImagesByTag(festival.name);
        return h.view("festival", {
          title: festival.name,
          festival: festival,
          report: report,
          attendance: attendance,
          categories: categories,
          images: images,
        });
      } catch (err) {
        const categories = await Category.find()
          .sort("categoryName")
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
};

module.exports = Festivals;
