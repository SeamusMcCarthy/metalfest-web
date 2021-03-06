"use strict";

require("./app/models/db");

const ImageStore = require("./app/utils/image-store");
const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const Handlebars = require("handlebars");
const Cookie = require("@hapi/cookie");
const Joi = require("@hapi/joi");
const env = require("dotenv");
const utils = require("./app/api/utils.js");

env.config();

const credentials = {
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_key,
  api_secret: process.env.cloud_secret,
};

// const server = Hapi.server({
//   port: 3000,
//   host: "localhost",
// });
const server = Hapi.server({
  port: process.env.PORT || 4000,
  routes: { cors: true },
});

async function init() {
  await server.register(Inert);
  await server.register(Vision);
  await server.register(Cookie);
  await server.register(require("hapi-auth-jwt2"));

  ImageStore.configure();

  server.validator(require("@hapi/joi"));

  // Setup for Hapi Vision rendering
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./app/views",
    layoutPath: "./app/views/layouts",
    partialsPath: "./app/views/partials",
    layout: true,
    isCached: false,
    helpersPath: "./app/utils/helpers",
  });

  // Initialise Hapi Cookie
  // Redirect protected routes to homepage
  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
  });

  server.auth.strategy("jwt", "jwt", {
    key: "secretpasswordnotrevealedtoanyone",
    validate: utils.validate,
    verifyOptions: { algorithms: ["HS256"] },
  });

  server.auth.default("session");

  server.route(require("./routes"));
  server.route(require("./routes-api"));

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
