const { faker } = require("@faker-js/faker");
const { describe, test, expect } = require("@jest/globals");
const { checkAPIBadRequest, checkAPIConflictResponse } = require("./utils");
const API = require("./api");

const truthyData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  phone: faker.phone.number("+20#########"),
  email: faker.internet.email(),
  password: faker.internet.password(10),
  allowMarketing: false,
  acceptTerms: true,
};

describe("Register API", () => {
  test("Should register a new user", async () => {
    const response = await API.register(truthyData);

    expect(response.status).toBe(200);
    expect(typeof response.data).toBe("object");
    expect(response.data).toEqual(
      expect.objectContaining({
        token: expect.any(String),
      })
    );
  });

  test("Missing First Name", async () => {
    let response = await API.register({
      ...truthyData,
      firstName: undefined,
    });

    checkAPIBadRequest(response, "First name is required", 1300);
  });

  test("Invalid First Name Length", async () => {
    let response = await API.register({
      ...truthyData,
      firstName: "a",
    });

    checkAPIBadRequest(
      response,
      "First name must be at least 2 characters",
      1301
    );
  });

  test("Missing Phone", async () => {
    let response = await API.register({
      ...truthyData,
      phone: undefined,
    });

    checkAPIBadRequest(response, "Phone is required", 1302);
  });

  test("Invalid Phone Length", async () => {
    let response = await API.register({
      ...truthyData,
      phone: "+20102222",
    });

    checkAPIBadRequest(response, "Phone must be at least 10 characters", 1303);
  });

  test("Invalid Phone Pattern", async () => {
    let response = await API.register({
      ...truthyData,
      phone: "+20102222a",
    });

    checkAPIBadRequest(response, "Phone must be a valid phone number", 1304);
  });

  test("Missing Email", async () => {
    let response = await API.register({
      ...truthyData,
      email: undefined,
    });

    checkAPIBadRequest(response, "Email is required", 1305);
  });

  test("Invalid Email Format", async () => {
    let response = await API.register({
      ...truthyData,
      email: "aaa@@ss.com",
    });

    checkAPIBadRequest(response, "Email must be a valid email address", 1306);
  });

  test("Must Accept Terms", async () => {
    let response = await API.register({
      ...truthyData,
      acceptTerms: false,
    });

    checkAPIBadRequest(
      response,
      "You must accept the terms and conditions",
      1307
    );
  });

  test("Fail on First Error", async () => {
    let response = await API.register({
      ...truthyData,
      firstName: undefined,
      acceptTerms: false,
    });

    expect(response.status).toBe(400);
    expect(typeof response.data).toBe("object");
    expect(response.data).toEqual(
      expect.objectContaining({
        error: expect.any(String),
        errorCode: expect.any(Number),
      })
    );
  });

  test("Email Conflict Error", async () => {
    const response = await API.register(truthyData);

    checkAPIConflictResponse(
      response,
      "Email address is already registered",
      1312
    );
  });
});
