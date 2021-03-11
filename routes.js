"use strict";

const Accounts = require("./app/controllers/accounts");
const Festivals = require("./app/controllers/festivals");
const Categories = require("./app/controllers/categories");
const Gallery = require("./app/controllers/gallery");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: "POST", path: "/add-festival", config: Festivals.addfest },
  { method: "GET", path: "/home", config: Festivals.home },
  { method: "GET", path: "/report", config: Festivals.report },
  { method: "GET", path: "/settings", config: Accounts.showSettings },
  { method: "POST", path: "/settings", config: Accounts.updateSettings },
  { method: "POST", path: "/add-category", config: Categories.addcategory },
  { method: "GET", path: "/admin-home", config: Festivals.adminhome },
  { method: "GET", path: "/fest-weather", config: Festivals.fetchWeather },
  { method: "GET", path: "/fest-dtls/{id}", config: Festivals.getDetails },
  { method: "GET", path: "/gallery", config: Gallery.index },
  { method: "POST", path: "/uploadfile", config: Gallery.uploadFile },
  { method: "GET", path: "/deleteimage/{id}", config: Gallery.deleteImage },

  // Make public folder available to all routes
  {
    method: "GET",
    path: "/{param*}",
    handler: { directory: { path: "./public" } },
    options: { auth: false },
  },
];
