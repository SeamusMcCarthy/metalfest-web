"use strict";
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const User = require("../models/user");
const Festival = require("../models/festival");
const Category = require("../models/category");

const Accounts = {
  index: {
    auth: false,
    handler: async function (request, h) {
      const categories = await Category.find()
        .populate("categoryFestivals")
        .lean();
      return h.view("main", {
        title: "Welcome to Metal Fest!!!",
        categories: categories,
      });
    },
  },
  showSignup: {
    auth: false,
    handler: async function (request, h) {
      const categories = await Category.find()
        .populate("categoryFestivals")
        .lean();
      return h.view("signup", {
        title: "Sign up for Metal Fest!!!",
        categories: categories,
      });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("main", {
            title: "Sign up error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let checkUser = await User.findByEmail(payload.email);
        if (checkUser) {
          const message = "Email address is already registered";
          console.log(message);
          throw Boom.unauthorized(message);
        }
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          userType: "regular",
        });
        const categories = await Category.find()
          .populate("categoryFestivals")
          .lean();
        const user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  showLogin: {
    auth: false,
    handler: async function (request, h) {
      const categories = await Category.find()
        .populate("categoryFestivals")
        .lean();
      return h.view("login", {
        title: "Login to MetalFest!!!",
        categories: categories,
      });
    },
  },
  selectHome: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id).lean();
      if (user.userType == "regular") return h.redirect("/home");
      else return h.redirect("/admin-home");
    },
  },
  login: {
    auth: false,
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        const categories = await Category.find()
          .populate("categoryFestivals")
          .lean();
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }
        user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });
        if (user.userType === "admin") {
          return h.redirect("/admin-home");
        } else {
          return h.redirect("/home");
        }
      } catch (err) {
        return h.view("login", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  showSettings: {
    handler: async function (request, h) {
      const categories = await Category.find()
        .populate("categoryFestivals")
        .lean();
      const id = request.auth.credentials.id;
      const user = await User.findById(id).lean();

      return h.view("settings", {
        title: "User Settings",
        user: user,
        categories: categories,
      });
    },
  },
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("main", {
            title: "Error updating details",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      const userEdit = request.payload;
      const id = request.auth.credentials.id;
      const user = await User.findById(id);
      user.firstName = userEdit.firstName;
      user.lastName = userEdit.lastName;
      user.email = userEdit.email;
      user.password = userEdit.password;
      await user.save();
      return h.redirect("/settings");
    },
  },
  deleteUser: {
    handler: async function (request, h) {
      try {
        const categories = await Category.find()
          .populate("categoryFestivals")
          .lean();
        const id = request.params.id;
        for await (const doc of Festival.find()) {
          doc.attendees.pull(id);
          doc.save();
        }
        await User.deleteOne({ _id: id });
        return h.redirect("/admin-home");
      } catch (err) {
        return h.view("login", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
};

module.exports = Accounts;
