"use strict";

const Image = require("../models/image");
const Boom = require("@hapi/boom");
const ImageStore = require("../utils/image-store");

const Images = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const images = await Image.find();
      return images;
    },
  },
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const image = await Image.findOne({ _id: request.params.id });
        if (!image) {
          return Boom.notFound("No image with this id");
        }
        return image;
      } catch (err) {
        return Boom.notFound("No image with this id");
      }
    },
  },
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const newImage = new Image(request.payload);
      const image = await newImage.save();
      if (image) {
        return h.response(image).code(201);
      }
      return Boom.badImplementation("error creating image");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Image.remove({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const image = await Image.remove({ _id: request.params.id });
      if (image) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deletePublicOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await ImageStore.deleteImage(request.params.id);
      return { success: true };
    },
  },

  getImagesTag: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        console.log(request.params.name);
        const images = await ImageStore.getImagesByTag(request.params.name);
        if (!images) {
          return Boom.notFound("No image with this id");
        }
        return images;
      } catch (err) {
        return Boom.notFound("No image with this id");
      }
    },
  },
};

module.exports = Images;
