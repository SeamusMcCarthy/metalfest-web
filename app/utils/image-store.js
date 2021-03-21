"use strict";

const cloudinary = require("cloudinary");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function () {
    const credentials = {
      cloud_name: process.env.name,
      api_key: process.env.key,
      api_secret: process.env.secret,
    };
    cloudinary.config(credentials);
  },

  getImagesByTag: async function (tagName) {
    const result = await cloudinary.v2.search
      .expression("tags:" + tagName)
      .execute();
    return result.resources;
  },
  getAllImages: async function () {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    await writeFile("./public/temp.img", imagefile);
    const result = await cloudinary.uploader.upload("./public/temp.img");
    return result;
  },
  uploadImageWithTag: async function (imagefile, tag) {
    await writeFile("./public/temp.img", imagefile);
    const result = await cloudinary.uploader.upload("./public/temp.img");
    const updImg = await cloudinary.uploader.add_tag(tag, result.public_id);
    return result;
  },

  deleteImage: async function (id) {
    await cloudinary.v2.uploader.destroy(id, {});
  },
};

module.exports = ImageStore;
