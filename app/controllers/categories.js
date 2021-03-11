"use strict";

const User = require("../models/user");
const Category = require("../models/category");

const Categories = {
  addcategory: {
    handler: async function (request, h) {
      try {
        const data = request.payload;
        // console.log(data);
        const newCategory = new Category({
          categoryName: data.category,
        });
        await newCategory.save();
        const categories = await Category.find().lean();
        return h.view("admin-home", {
          title: "Festivals added to date",
          categories: categories,
        });
      } catch (err) {
        return h.view("main", { errors: [{ message: err.message }] });
      }
    },
  },
};

module.exports = Categories;
