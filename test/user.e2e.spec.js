const request = require("supertest");
const fs = require("fs/promises");
require("dotenv").config();
const db = require("../config/db");
const app = require("../app");
const { HttpCode } = require("../config/constants");
const User = require("../model/user_schema");
const { newUserForRouteUser } = require("./data/data");

jest.mock("cloudinary");

describe("Test route users", () => {
  let token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUserForRouteUser.email });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUserForRouteUser.email });
    await mongo.disconnect();
  });

  it("Signup user", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newUserForRouteUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(HttpCode.CREATED);
    expect(response.body).toBeDefined();
  });

  it("User exist with return status 409", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send(newUserForRouteUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(HttpCode.CONFLICT);
    expect(response.body).toBeDefined();
  });

  it("Login user", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(newUserForRouteUser)
      .set("Accept", "application/json");

    expect(response.status).toEqual(HttpCode.OK);
    expect(response.body).toBeDefined();

    token = response.body.token;
  });

  it("Upload avatar for user", async () => {
    const buffer = await fs.readFile("./test/data/avatar_female.png");
    const response = await request(app)
      .patch(`/api/users/avatars`)
      .set("Authorization", `Bearer ${token}`)
      .attach("avatar", buffer, "avatar_female.png");

    expect(response.status).toEqual(HttpCode.OK);
    expect(response.body).toBeDefined();
    console.log(response.body);
  });
});
