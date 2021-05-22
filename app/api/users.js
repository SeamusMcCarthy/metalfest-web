"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const utils = require("./utils.js");
const sanitize = require("sanitize-html");
const bcrypt = require("bcrypt"); // ADDED
const saltRounds = 10; // ADDED

const Users = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No user with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No user with this id");
      }
    },
  },
  findEmail: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.params.email });
        if (!user) {
          return Boom.notFound("No user with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No user with this id");
      }
    },
  },
  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const data = request.payload;
        const hash = await bcrypt.hash(sanitize(data.password), saltRounds);
        // const newUser = new User(request.payload);
        const newUser = new User({
          firstName: sanitize(data.firstName),
          lastName: sanitize(data.lastName),
          email: sanitize(data.email),
          // password: sanitize(data.password),
          password: hash,
          userType: sanitize(data.userType),
        });
        const user = await newUser.save();
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {}
      return Boom.badImplementation("error creating user");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      // await User.remove({});
      await User.deleteMany({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({
          email: sanitize(request.payload.email),
        });
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (
          await user.comparePassword(sanitize(request.payload.password))
        ) {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        } else {
          return Boom.unauthorized("Invalid password");
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const userEdit = request.payload;
      const hash = await bcrypt.hash(sanitize(userEdit.password), saltRounds);
      const user = await User.findById(userEdit._id);
      user.firstName = sanitize(userEdit.firstName);
      user.lastName = sanitize(userEdit.lastName);
      user.email = sanitize(userEdit.email);
      // user.password = sanitize(userEdit.password);
      user.password = hash;
      await user.save();
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },
};

module.exports = Users;
