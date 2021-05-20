"use strict";

const axios = require("axios");
const baseUrl = "";

class MetalfestService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getCategories() {
    const response = await axios.get(this.baseUrl + "/api/categories");
    return response.data;
  }

  async getFestivals() {
    const response = await axios.get(this.baseUrl + "/api/festivals");
    return response.data;
  }

  async getImages() {
    const response = await axios.get(this.baseUrl + "/api/images");
    return response.data;
  }

  async getUsers() {
    const response = await axios.get(this.baseUrl + "/api/users");
    return response.data;
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/categories/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getFestival(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/festivals/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getImage(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/images/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCategory(newCategory) {
    const response = await axios.post(
      this.baseUrl + "/api/categories",
      newCategory
    );
    return response.data;
  }

  async createFestival(newFestival) {
    const response = await axios.post(
      this.baseUrl + "/api/festivals1",
      newFestival
    );
    return response.data;
  }

  async createImage(newImage) {
    const response = await axios.post(this.baseUrl + "/api/images", newImage);
    return response.data;
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllCategories() {
    const response = await axios.delete(this.baseUrl + "/api/categories");
    return response.data;
  }

  async deleteAllFestivals() {
    const response = await axios.delete(this.baseUrl + "/api/festivals");
    return response.data;
  }

  async deleteAllImages() {
    const response = await axios.delete(this.baseUrl + "/api/images");
    return response.data;
  }

  async deleteAllUsers() {
    const response = await axios.delete(this.baseUrl + "/api/users");
    return response.data;
  }

  async deleteOneCategory(id) {
    const response = await axios.delete(this.baseUrl + "/api/categories/" + id);
    return response.data;
  }

  async deleteOneFestival(id) {
    const response = await axios.delete(this.baseUrl + "/api/festivals/" + id);
    return response.data;
  }

  async deleteOneImage(id) {
    const response = await axios.delete(this.baseUrl + "/api/images/" + id);
    return response.data;
  }

  async deleteOneUser(id) {
    const response = await axios.delete(this.baseUrl + "/api/users/" + id);
    return response.data;
  }

  async authenticate(user) {
    try {
      const response = await axios.post(
        this.baseUrl + "/api/users/authenticate",
        user
      );
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async clearAuth(user) {
    axios.defaults.headers.common["Authorization"] = "";
  }
}

module.exports = MetalfestService;
