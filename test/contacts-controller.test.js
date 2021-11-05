const { update } = require("../controllers/contacts_controller");
const Contacts = require("../repository/contacts");
const { HttpCode } = require("../config/constants");
const { CustomError } = require("../helpers/custom_error");

jest.mock("../repository/contacts");

describe("Unit test controller update", () => {
  let req, res, next;

  beforeEach(() => {
    Contacts.updateContact = jest.fn();
    req = { params: { id: 3 }, body: {}, user: { _id: 1 } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    };
    next = jest.fn();
  });

  it("Contact exist", async () => {
    const contact = { id: 3, name: "Lena" };
    Contacts.updateContact = jest.fn(() => {
      return contact;
    });
    const result = await update(req, res, next);
    expect(result).toBeDefined();
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("code");
    expect(result).toHaveProperty("data");
    expect(result.data.contact).toEqual(contact);
  });

  it("Contact not exist v.1.0", async () => {
    await expect(update(req, res, next)).rejects.toEqual(
      new CustomError(HttpCode.NOT_FOUND, "Not found!")
    );
  });

  it("Contact not exist v.1.1", () => {
    return update(req, res, next).catch((e) => {
      expect(e.status).toEqual(404), expect(e.message).toEqual("Not found!");
    });
  });
});
