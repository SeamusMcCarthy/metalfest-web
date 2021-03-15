"use strict";
const Boom = require("@hapi/boom");
const User = require("../models/user");
const Festival = require("../models/festival");

const Accounts = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Metal Fest!!!" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", { title: "Sign up for Metal Fest!!!" });
    },
  },
  signup: {
    auth: false,
    handler: async function (request, h) {
      const payload = request.payload;
      const newUser = new User({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
        userType: "regular",
      });
      const user = await newUser.save();
      request.cookieAuth.set({ id: user.id });
      return h.redirect("/home");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", { title: "Login to MetalFest!!!" });
    },
  },
  selectHome: {
    handler: async function (request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id).lean();
      console.log("User type = " + user.userType);
      if (user.userType == "regular") return h.redirect("/home");
      else return h.redirect("/admin-home");
    },
  },
  login: {
    auth: false,
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "Email address is not registered";
          console.log(message);
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
        return h.view("login", { errors: [{ message: err.message }] });
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
      const id = request.auth.credentials.id;
      const user = await User.findById(id).lean();

      return h.view("settings", {
        title: "User Settings",
        user: user,
      });
    },
  },
  updateSettings: {
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
        const id = request.params.id;
        for await (const doc of Festival.find()) {
          doc.attendees.pull(id);
          doc.save();
        }
        await User.deleteOne({ _id: id });
        return h.redirect("/admin-home");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    },
  },
};

module.exports = Accounts;
