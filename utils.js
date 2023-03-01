require("dotenv").config();

const getAPIURL = (path) => new URL(path, process.env.API_ROOT).toString();

const checkAPIBadRequest = (response, message, code) => {
  expect(response.status).toBe(400);
  expect(typeof response.data).toBe("object");
  expect(response.data).toEqual(
    expect.objectContaining({
      error: expect.stringContaining(message),
      errorCode: code,
    })
  );
};

const checkAPIConflictResponse = (response, message, code) => {
  expect(response.status).toBe(409);
  expect(typeof response.data).toBe("object");
  expect(response.data).toEqual(
    expect.objectContaining({
      error: expect.stringContaining(message),
      errorCode: code,
    })
  );
};

const checkAPIUnauthorized = (
  response,
  message = "Unauthorized",
  code = "401"
) => {
  expect(response.status).toBe(401);
  expect(typeof response.data).toBe("object");
  expect(response.data).toEqual(
    expect.objectContaining({
      error: expect.stringContaining(message),
      errorCode: code,
    })
  );
};

module.exports = {
  getAPIURL,
  checkAPIBadRequest,
  checkAPIConflictResponse,
  checkAPIUnauthorized,
};
