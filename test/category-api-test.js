"use strict";

const assert = require("chai").assert;
const MetalfestService = require("./metalfest-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Category API tests", function () {
  let baseUrl = fixtures.metalfestService;
  let categories = fixtures.categories;
  let newCategory = fixtures.newCategory;
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
    await metalfestService.deleteAllCategories();
  });

  teardown(async function () {
    await metalfestService.deleteAllCategories();
  });

  test("create a category", async function () {
    const returnedCategory = await metalfestService.createCategory(newCategory);
    assert(
      _.some([returnedCategory], newCategory),
      "returnedCategory must be a superset of newCategory"
    );
    assert.isDefined(returnedCategory._id);
  });

  test("get invalid category", async function () {
    const c1 = await metalfestService.getCategory("1234");
    assert.isNull(c1);
    const c2 = await metalfestService.getCategory("012345678901234567890123");
    assert.isNull(c2);
  });

  test("delete a category", async function () {
    let c = await metalfestService.createCategory(newCategory);
    assert(c._id != null);
    await metalfestService.deleteOneCategory(c._id);
    c = await metalfestService.getCategory(c._id);
    assert(c == null);
  });

  test("get all categories", async function () {
    for (let c of categories) {
      await metalfestService.createCategory(c);
    }

    const allCategories = await metalfestService.getCategories();
    assert.equal(allCategories.length, categories.length);
  });

  test("get categories detail", async function () {
    for (let c of categories) {
      await metalfestService.createCategory(c);
    }

    const allCategories = await metalfestService.getCategories();
    for (var i = 0; i < categories.length; i++) {
      assert(
        _.some([allCategories[i]], categories[i]),
        "returnedCategory must be a superset of newCategory"
      );
    }
  });

  test("get all categories empty", async function () {
    const allCategories = await metalfestService.getCategories();
    assert.equal(allCategories.length, 0);
  });
});

// Original version
// const assert = require("chai").assert;
// const axios = require("axios");
//
// suite("Category API tests", function () {
//   test("get categories", async function () {
//     const response = await axios.get("http://localhost:3000/api/categories");
//     const categories = response.data;
//     assert.equal(8, categories.length);
//   });
//
//   test("get one category", async function () {
//     let response = await axios.get("http://localhost:3000/api/categories");
//     const categories = response.data;
//     assert.equal(8, categories.length);
//
//     const oneCategoryUrl =
//       "http://localhost:3000/api/categories/" + categories[0]._id;
//     response = await axios.get(oneCategoryUrl);
//     const oneCategory = response.data;
//
//     assert.equal(oneCategory.categoryName, "Death metal");
//   });
//
//   test("create a category", async function () {
//     const categoriesUrl = "http://localhost:3000/api/categories";
//     const newCategory = {
//       categoryName: "Polka",
//     };
//
//     const response = await axios.post(categoriesUrl, newCategory);
//     const returnedCategory = response.data;
//     assert.equal(201, response.status);
//
//     assert.equal(returnedCategory.categoryName, "Polka");
//   });
//
//   test("delete one category", async function () {
//     let response = await axios.get("http://localhost:3000/api/categories");
//     let categories = response.data;
//     assert.equal(9, categories.length);
//
//     const oneCategoryUrl =
//       "http://localhost:3000/api/categories/" + categories[0]._id;
//     response = await axios.delete(oneCategoryUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/categories");
//     categories = response.data;
//     assert.equal(8, categories.length);
//   });
//
//   test("delete all categories", async function () {
//     let response = await axios.get("http://localhost:3000/api/categories");
//     let categories = response.data;
//     assert.equal(8, categories.length);
//
//     const oneCategoryUrl = "http://localhost:3000/api/categories";
//     response = await axios.delete(oneCategoryUrl);
//     assert.equal(200, response.status);
//
//     response = await axios.get("http://localhost:3000/api/categories");
//     categories = response.data;
//     assert.equal(0, categories.length);
//   });
// });
