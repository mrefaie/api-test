const axios = require("axios");
const { getAPIURL } = require("./utils");

const APIRequest = async (request) => {
  try {
    const response = await axios(request);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response;
    } else if (error.request) {
      throw new Error(error.request);
    } else {
      throw new Error(error.message);
    }
  }
};

const API = {
  register: async (data) => {
    return await APIRequest({
      method: "POST",
      url: getAPIURL("register"),
      data,
    });
  },
};

module.exports = API;
