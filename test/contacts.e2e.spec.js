const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../config/db");
const app = require("../app");
const { HttpCode } = require("../config/constants");
const { CustomError } = require("../helpers/custom_error");
const Contact = require("../model/contact_schema");
const User = require("../model/user_schema");
const { newContact, newUserForRouteCat } = require("./data/data");

describe("Test route contacts", () => {
  let user, token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUserForRouteCat.email });
    user = await User.create(newUserForRouteCat);
    const SERCRET_KEY = process.env.JWT_SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, SERCRET_KEY);
    await User.updateOne({ _id: user._id }, { token });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUserForRouteCat.email });
    await mongo.disconnect();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  describe("GET request", () => {
    it("should return status 200 to get all contacts", async () => {
      const response = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.contacts).toBeInstanceOf(Array);
    });

    it("should return status 200 to get contact byId", async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const response = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.contact).toBeDefined();
      expect(response.body.data.contact).toHaveProperty("id");
      expect(response.body.data.contact).toHaveProperty("name");
    });

    it("should return status 404 if contact not found", async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const response = await request(app)
        .get(`/api/contacts/${user._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(404);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("code");
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST request", () => {
    it("should return status 201 create contact", async () => {
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact)
        .set("Accept", "application/json");

      expect(response.status).toEqual(HttpCode.CREATED);
      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("code");
      expect(response.body.data.result).toBeDefined();
      expect(response.body.data.result).toHaveProperty("id");
      expect(response.body.data.result).toHaveProperty("name");
    });
  });

  describe("DELETE request", () => {
    it("should return status 200 remove contact", async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const response = await request(app)
        .delete(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.result).toBeDefined();
      expect(response.body.data.result).toHaveProperty("id");
      expect(response.body.data.result).toHaveProperty("name");
    });
  });

  describe("UPDATE request", () => {
    it("should return status 200 update contact", async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const response = await request(app)
        .put(`/api/contacts/${contact._id}`)
        .send(newContact)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.contact).toBeDefined();
      expect(response.body.data.contact).toHaveProperty("id");
      expect(response.body.data.contact).toHaveProperty("name");
    });
  });
});
