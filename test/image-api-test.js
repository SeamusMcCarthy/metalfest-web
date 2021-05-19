"use strict";

const assert = require("chai").assert;
const MetalfestService = require("./metalfest-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Image API tests", function () {
  let baseUrl = fixtures.metalfestService;
  let images = fixtures.images;
  let newImage = fixtures.newImage;

  const metalfestService = new MetalfestService(baseUrl);
  let newUser = fixtures.newUser;

  suiteSetup(async function () {
    await metalfestService.deleteAllUsers();
    const returnedUser = await metalfestService.createUser(newUser);
    const response = await metalfestService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await metalfestService.deleteAllUsers();
    metalfestService.clearAuth();
  });

  setup(async function () {
    await metalfestService.deleteAllImages();
  });

  teardown(async function () {
    await metalfestService.deleteAllImages();
  });

  test("create an image", async function () {
    const returnedImage = await metalfestService.createImage(newImage);
    assert(
      _.some([returnedImage], newImage),
      "returnedImage must be a superset of newImage"
    );
    assert.isDefined(returnedImage._id);
  });

  test("get invalid image", async function () {
    const c1 = await metalfestService.getImage("1234");
    assert.isNull(c1);
    const c2 = await metalfestService.getImage("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete an image", async function () {
    let c = await metalfestService.createImage(newImage);
    assert(c._id != null);
    await metalfestService.deleteOneImage(c._id);
    c = await metalfestService.getImage(c._id);
    assert(c == null);
  });

  test("get all images", async function () {
    for (let c of images) {
      await metalfestService.createImage(c);
    }

    const allImages = await metalfestService.getImages();
    assert.equal(allImages.length, images.length);
  });

  test("get images detail", async function () {
    for (let c of images) {
      await metalfestService.createImage(c);
    }

    const allImages = await metalfestService.getImages();
    for (var i = 0; i < images.length; i++) {
      assert(
        _.some([allImages[i]], images[i]),
        "returnedImage must be a superset of newImage"
      );
    }
  });

  test("get all images empty", async function () {
    const allImages = await metalfestService.getImages();
    assert.equal(allImages.length, 0);
  });
});

// Original version
// const assert = require("chai").assert;
// const axios = require("axios");
//
// suite("Image API tests", function () {
//   test("get images", async function () {
//     const response = await axios.get("http://localhost:3000/api/images");
//     const images = response.data;
//     assert.equal(6, images.length);
//   });
//
//   test("get one image", async function () {
//     let response = await axios.get("http://localhost:3000/api/images");
//     const images = response.data;
//     assert.equal(6, images.length);
//
//     const oneImageUrl = "http://localhost:3000/api/images/" + images[0]._id;
//     response = await axios.get(oneImageUrl);
//     const oneImage = response.data;
//
//     assert.equal(
//       oneImage.imageURL,
//       "https://res.cloudinary.com/semcwit/image/upload/v1616436604/Graspop_amanow.jpg"
//     );
//   });
//
//   test("create an image", async function () {
//     const imagesUrl = "http://localhost:3000/api/images";
//     const newImage = {
//       imageURL: "http://www.google.com",
//       // categoryFestivals: [],
//     };
//
//     const response = await axios.post(imagesUrl, newImage);
//     const returnedImage = response.data;
//     assert.equal(201, response.status);
//
//     assert.equal(returnedImage.imageURL, "http://www.google.com");
//   });
//
//   test("delete one image", async function () {
//     let response = await axios.get("http://localhost:3000/api/images");
//     let images = response.data;
//     assert.equal(7, images.length);
//
//     const oneImageUrl = "http://localhost:3000/api/images/" + images[0]._id;
//     response = await axios.delete(oneImageUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/images");
//     images = response.data;
//     assert.equal(6, images.length);
//   });
//
//   test("delete all images", async function () {
//     let response = await axios.get("http://localhost:3000/api/images");
//     let images = response.data;
//     assert.equal(6, images.length);
//
//     const imageUrl = "http://localhost:3000/api/images";
//     response = await axios.delete(imageUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/images");
//     images = response.data;
//     assert.equal(0, images.length);
//   });
// });
