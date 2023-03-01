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
  login: async (data) => {
    return await APIRequest({
      method: "POST",
      url: getAPIURL("login"),
      data,
    });
  },
  getOTP: async (phone) => {
    const response = await APIRequest({
      method: "GET",
      url: getAPIURL("otps"),
    });

    return response.data.filter((r) => r.phone_number === phone).pop().otp;
  },
};

module.exports = API;
