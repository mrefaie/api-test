const { faker } = require("@faker-js/faker");
const { describe, test, expect } = require("@jest/globals");
const {
  checkAPIBadRequest,
  checkAPIConflictResponse,
  checkAPIUnauthorized,
} = require("./utils");
const API = require("./api");

const email = faker.internet.email();
const password = faker.internet.password(10);

const truthyRegisterData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.phone.number("+20#########"),
  email,
  password,
  allowMarketing: false,
  acceptTerms: true,
};

const truthyLoginData = { email, password };

describe("Login API", () => {
  beforeAll(async () => {
    const registerResponse = await API.register(truthyRegisterData);
  });

  test("User Login Unauthorized", async () => {
    const loginResponse = await API.login({
      ...truthyLoginData,
      password: "xxx",
    });

    checkAPIUnauthorized(loginResponse, "Invalid email or password", 1003);
  });

  test("User Login Successful Attempt", async () => {
    const loginResponse = await API.login(truthyLoginData);

    expect(loginResponse.status).toBe(200);
    expect(typeof loginResponse.data).toBe("object");
    expect(loginResponse.data).toEqual(
      expect.objectContaining({
        requires2fa: false,
        token: expect.any(String),
      })
    );
  });

  test("Missing Email", async () => {
    let response = await API.login({
      ...truthyLoginData,
      email: undefined,
    });

    checkAPIBadRequest(response, "Email is required", 1000);
  });

  test("Missing Password", async () => {
    let response = await API.login({
      ...truthyLoginData,
      password: undefined,
    });

    checkAPIBadRequest(response, "Password is required", 1001);
  });

  // test("Invalid OTP", async () => {
  //   let response = await API.login({
  //     ...truthyLoginData,
  //     otp: "xxxxxx",
  //   });

  //   checkAPIBadRequest(response, "OTP is invalid", 1002);
  // });

  test("Null Email", async () => {
    let response = await API.login({
      ...truthyLoginData,
      email: null,
    });

    checkAPIBadRequest(response, "Email is required", 1000);
  });

  test("Null Password", async () => {
    let response = await API.login({
      ...truthyLoginData,
      password: null,
    });

    checkAPIBadRequest(response, "Password is required", 1001);
  });

  // test("Null OTP", async () => {
  //   let response = await API.login({
  //     ...truthyLoginData,
  //     otp: null,
  //   });

  //   checkAPIBadRequest(response, "OTP is invalid", 1002);
  // });

  // test("User Login Successful Attempt", async () => {
  //   let response = await API.login({
  //     ...truthyLoginData,
  //     otp: await API.getOTP(truthyRegisterData.phone),
  //   });

  //   expect(response.status).toBe(200);
  //   expect(typeof response.data).toBe("object");
  //   expect(response.data).toEqual(
  //     expect.objectContaining({
  //       requires2fa: false,
  //       token: expect.any(String),
  //     })
  //   );
  // });
});
