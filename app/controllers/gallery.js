"use strict";

const ImageStore = require("../utils/image-store");

const Gallery = {
  // index: {
  //   handler: async function (request, h) {
  //     try {
  //       const allImages = await ImageStore.getAllImages();
  //       return h.view("gallery", {
  //         title: "Cloudinary Gallery",
  //         images: allImages,
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   },
  // },

  uploadFile: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const image = await ImageStore.uploadImage(request.payload.imagefile);
          return h.redirect("/");
        }
        return h.view("main", {
          title: "Image upload",
          error: "No file selected",
        });
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  uploadAddImage: {
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const image = await ImageStore.uploadImageWithTag(
            request.payload.imagefile,
            request.payload.festName
          );
          return h.redirect("/fest-dtls/" + request.payload.festID);
        }
        return h.view("main", {
          title: "Image upload",
          error: "No file selected",
        });
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
        return h.redirect("/report");
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = Gallery;
