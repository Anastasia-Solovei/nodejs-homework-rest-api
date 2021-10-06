const crypto = require("crypto");
const DB = require("../model/db");
const db = new DB("../model/contacts.json");

const listContacts = async (_req, res, next) => {
  try {
    const contacts = await db.read();

    res.json({
      status: "success",
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await db.read();

    const [contact] = contacts.filter((contact) => contact.id === contactId);
    if (contact) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      });
    }
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found!",
    });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const body = req.body;
    const contacts = await db.read();

    const newContact = {
      id: crypto.randomUUID(),
      ...body,
    };

    contacts.push(newContact);
    await db.write(contacts);

    res.json({
      status: "success",
      code: 201,
      data: {
        newContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contacts = await db.read();

    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index !== -1) {
      const contactToDelete = contacts[index];
      contacts.splice(index, 1);
      await db.write(contacts);

      return res.json({
        status: "success",
        code: 200,
        message: `Contact with id ${contactToDelete.id} deleted!`,
      });
    }
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found!",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const contacts = await db.read();

    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index !== -1) {
      const contact = contacts[index];
      contacts[index] = { ...contact, ...body };
      await db.write(contacts);
      const updatedContact = contacts[index];

      return res.json({
        status: "success",
        code: 200,
        data: {
          updatedContact,
        },
      });
    }

    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
