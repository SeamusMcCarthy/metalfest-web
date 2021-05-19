"use strict";

const assert = require("chai").assert;
const MetalfestService = require("./metalfest-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Festival API tests", function () {
  let baseUrl = fixtures.metalfestService;
  let festivals = fixtures.festivals;
  let newFestival = fixtures.newFestival;

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
    await metalfestService.deleteAllFestivals();
  });

  teardown(async function () {
    await metalfestService.deleteAllFestivals();
  });

  test("create a festival", async function () {
    const returnedFestival = await metalfestService.createFestival(newFestival);
    assert(
      _.some([returnedFestival], newFestival),
      "returnedFestival must be a superset of newFestival"
    );
    assert.isDefined(returnedFestival._id);
  });

  test("get invalid festival", async function () {
    const c1 = await metalfestService.getFestival("1234");
    assert.isNull(c1);
    const c2 = await metalfestService.getFestival("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a festival", async function () {
    let c = await metalfestService.createFestival(newFestival);
    assert(c._id != null);
    await metalfestService.deleteOneFestival(c._id);
    c = await metalfestService.getFestival(c._id);
    assert(c == null);
  });

  test("get all festivals", async function () {
    for (let c of festivals) {
      await metalfestService.createFestival(c);
    }

    const allFestivals = await metalfestService.getFestivals();
    assert.equal(allFestivals.length, festivals.length);
  });

  test("get festivals detail", async function () {
    for (let c of festivals) {
      await metalfestService.createFestival(c);
    }

    const allFestivals = await metalfestService.getFestivals();
    for (var i = 0; i < festivals.length; i++) {
      assert(
        _.some([allFestivals[i]], festivals[i]),
        "returnedFestival must be a superset of newFestival"
      );
    }
  });

  test("get all festivals empty", async function () {
    const allFestivals = await metalfestService.getFestivals();
    assert.equal(allFestivals.length, 0);
  });
});

// Original version
// const assert = require("chai").assert;
// const axios = require("axios");
//
// suite("Festival API tests", function () {
//   test("get festivals", async function () {
//     const response = await axios.get("http://localhost:3000/api/festivals");
//     const festivals = response.data;
//     assert.equal(6, festivals.length);
//   });
//
//   test("get one festival", async function () {
//     let response = await axios.get("http://localhost:3000/api/festivals");
//     const festivals = response.data;
//     assert.equal(6, festivals.length);
//
//     const oneFestivalUrl =
//       "http://localhost:3000/api/festivals/" + festivals[0]._id;
//     response = await axios.get(oneFestivalUrl);
//     const oneFestival = response.data;
//
//     assert.equal(oneFestival.name, "Graspop");
//   });
//
//   test("create a festival", async function () {
//     // Get an image to use
//     let response = await axios.get("http://localhost:3000/api/images");
//     const images = response.data;
//     const oneImageUrl = "http://localhost:3000/api/images/" + images[0]._id;
//     response = await axios.get(oneImageUrl);
//     const oneImage = response.data;
//     console.log("image id = " + oneImage._id);
//
//     // Get a user to use
//     response = await axios.get("http://localhost:3000/api/users");
//     const users = response.data;
//     const oneUserUrl = "http://localhost:3000/api/users/" + users[0]._id;
//     response = await axios.get(oneUserUrl);
//     const oneUser = response.data;
//     console.log("User id = " + oneUser._id);
//
//     const festivalsUrl = "http://localhost:3000/api/festivals";
//     const newFestival = {
//       name: "Graspop2",
//       city: "Dessel2",
//       country: "Belgium2",
//       description: "Large fest in Belgium",
//       image: oneImage._id,
//       latitude: 54.2421,
//       longitude: 5.1121,
//       // startDate: "2021-06-17",
//       // endDate: "2021-06-20",
//       approvalStatus: "pending",
//       addedBy: oneUser._id,
//       attendees: [oneUser._id],
//     };
//
//     response = await axios.post(festivalsUrl, newFestival);
//     const returnedFestival = response.data;
//     assert.equal(201, response.status);
//
//     assert.equal(returnedFestival.name, "Graspop2");
//   });
//
//   test("delete one festival", async function () {
//     let response = await axios.get("http://localhost:3000/api/festivals");
//     let festivals = response.data;
//     assert.equal(7, festivals.length);
//
//     const oneFestivalUrl =
//       "http://localhost:3000/api/festivals/" + festivals[0]._id;
//     response = await axios.delete(oneFestivalUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/festivals");
//     festivals = response.data;
//     assert.equal(6, festivals.length);
//   });
//
//   test("delete all festivals", async function () {
//     let response = await axios.get("http://localhost:3000/api/festivals");
//     let festivals = response.data;
//     // assert.equal(8, festivals.length);
//
//     const festivalUrl = "http://localhost:3000/api/festivals";
//     response = await axios.delete(festivalUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/festivals");
//     festivals = response.data;
//     assert.equal(0, festivals.length);
//   });
// });
