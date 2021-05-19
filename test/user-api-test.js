"use strict";

const assert = require("chai").assert;
const MetalfestService = require("./metalfest-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("User API tests", function () {
  let baseUrl = fixtures.metalfestService;
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const metalfestService = new MetalfestService(baseUrl);

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
    await metalfestService.deleteAllUsers();
  });

  teardown(async function () {
    await metalfestService.deleteAllUsers();
  });

  test("create a user", async function () {
    const returnedUser = await metalfestService.createUser(newUser);
    assert(
      _.some([returnedUser], newUser),
      "returnedUser must be a superset of newUser"
    );
    assert.isDefined(returnedUser._id);
  });

  test("get invalid user", async function () {
    const c1 = await metalfestService.getUser("1234");
    assert.isNull(c1);
    const c2 = await metalfestService.getUser("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a user", async function () {
    let c = await metalfestService.createUser(newUser);
    assert(c._id != null);
    await metalfestService.deleteOneUser(c._id);
    c = await metalfestService.getUser(c._id);
    assert(c == null);
  });

  test("get all users", async function () {
    for (let c of users) {
      await metalfestService.createUser(c);
    }

    const allUsers = await metalfestService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("get users detail", async function () {
    for (let c of users) {
      await metalfestService.createUser(c);
    }

    const allUsers = await metalfestService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(
        _.some([allUsers[i]], users[i]),
        "returnedUser must be a superset of newUser"
      );
    }
  });

  test("get all users empty", async function () {
    const allUsers = await metalfestService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});

// Original version
// const assert = require("chai").assert;
// const axios = require("axios");
//
// suite("User API tests", function () {
//   test("get users", async function () {
//     const response = await axios.get("http://localhost:3000/api/users");
//     const users = response.data;
//     assert.equal(3, users.length);
//   });
//
//   test("get one user", async function () {
//     let response = await axios.get("http://localhost:3000/api/users");
//     const users = response.data;
//     // assert.equal(8, categories.length);
//
//     const oneUserUrl = "http://localhost:3000/api/users/" + users[0]._id;
//     response = await axios.get(oneUserUrl);
//     const oneUser = response.data;
//
//     assert.equal(oneUser.firstName, "Homer");
//   });
//
//   test("create a user", async function () {
//     const usersUrl = "http://localhost:3000/api/users";
//     const newUser = {
//       firstName: "Seamus",
//       lastName: "Simpson",
//       email: "seamus@simpson.com",
//       password: "secret",
//       userType: "regular",
//     };
//
//     const response = await axios.post(usersUrl, newUser);
//     const returnedUser = response.data;
//     assert.equal(201, response.status);
//
//     assert.equal(returnedUser.firstName, "Seamus");
//   });
//
//   test("delete one user", async function () {
//     let response = await axios.get("http://localhost:3000/api/users");
//     let users = response.data;
//     assert.equal(4, users.length);
//
//     const oneUserUrl = "http://localhost:3000/api/users/" + users[0]._id;
//     response = await axios.delete(oneUserUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/users");
//     users = response.data;
//     assert.equal(3, users.length);
//   });
//
//   test("delete all users", async function () {
//     let response = await axios.get("http://localhost:3000/api/users");
//     let users = response.data;
//     assert.equal(3, users.length);
//
//     const usersUrl = "http://localhost:3000/api/users";
//     response = await axios.delete(usersUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/users");
//     users = response.data;
//     assert.equal(0, users.length);
//   });
// });
