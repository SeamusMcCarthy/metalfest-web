"use strict";

const Joi = require("@hapi/joi");
const User = require("../models/user");
const Category = require("../models/category");

const Categories = {
  addcategory: {
    validate: {
      payload: {
        category: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("main", {
            title: "Error adding category",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const data = request.payload;
        if ((await Category.findByName(data.category).countDocuments()) == 0) {
          const newCategory = new Category({
            categoryName: data.category,
          });
          await newCategory.save();
        }
        return h.redirect("/admin-home");
      } catch (err) {
        const categories = await Category.find()
          .populate("categoryFestivals")
          .lean();
        return h.view("main", {
          errors: [{ message: err.message }],
          categories: categories,
        });
      }
    },
  },
};

module.exports = Categories;
