const Categories = require("./app/api/categories");
const Festivals = require("./app/api/festivals");
const Images = require("./app/api/images");
const Users = require("./app/api/users");

module.exports = [
  { method: "GET", path: "/api/categories", config: Categories.find },
  { method: "GET", path: "/api/categories/{id}", config: Categories.findOne },
  { method: "POST", path: "/api/categories", config: Categories.create },
  {
    method: "DELETE",
    path: "/api/categories/{id}",
    config: Categories.deleteOne,
  },
  { method: "DELETE", path: "/api/categories", config: Categories.deleteAll },

  { method: "GET", path: "/api/festivals", config: Festivals.find },
  { method: "GET", path: "/api/festivals/{id}", config: Festivals.findOne },
  { method: "POST", path: "/api/festivals1", config: Festivals.create },
  { method: "POST", path: "/api/festivals", config: Festivals.create2 },
  {
    method: "DELETE",
    path: "/api/festivals/{id}",
    config: Festivals.deleteOne,
  },
  { method: "DELETE", path: "/api/festivals", config: Festivals.deleteAll },

  { method: "GET", path: "/api/images", config: Images.find },
  { method: "GET", path: "/api/images/{id}", config: Images.findOne },
  { method: "GET", path: "/api/imagename/{name}", config: Images.getImagesTag },
  { method: "POST", path: "/api/images", config: Images.create },
  { method: "POST", path: "/api/imageadd", config: Images.uploadAddImage },
  {
    method: "DELETE",
    path: "/api/images/{id}",
    config: Images.deleteOne,
  },
  {
    method: "DELETE",
    path: "/api/imagepublic/{id}",
    config: Images.deletePublicOne,
  },
  { method: "DELETE", path: "/api/images", config: Images.deleteAll },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "GET", path: "/api/useremail/{email}", config: Users.findEmail },
  { method: "POST", path: "/api/users", config: Users.create },
  {
    method: "DELETE",
    path: "/api/users/{id}",
    config: Users.deleteOne,
  },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },
  {
    method: "POST",
    path: "/api/users/authenticate",
    config: Users.authenticate,
  },
  {
    method: "GET",
    path: "/api/weather/{location}",
    config: Festivals.getWeather,
  },
  { method: "PUT", path: "/api/users/{id}", config: Users.update },
];
