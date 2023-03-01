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
let token;

describe("Login API", () => {
  beforeAll(async () => {
    const registerResponse = await API.register(truthyRegisterData);
    // const loginResponse = await API.login({
    //   ...truthyLoginData,
    // });
    token = registerResponse.data.token;
  });

  test("Unauthorized Me Request", async () => {
    const response = await API.me();

    checkAPIUnauthorized(response, "Unauthorized", 401);
  });

  test("Successful Me Request", async () => {
    const response = await API.me(token);

    expect(response.status).toBe(200);
    expect(typeof response.data).toBe("object");
    expect(response.data).toEqual(
      expect.objectContaining({
        firstName: truthyRegisterData.firstName,
        lastName: truthyRegisterData.lastName,
        email: truthyRegisterData.email,
        phone: truthyRegisterData.phone,
        allowMarketingEmails: truthyRegisterData.allowMarketingEmails,
        isVerified: expect.any(Boolean),
        fcmToken: expect.anyOf([String, null]),
      })
    );
  });
});
