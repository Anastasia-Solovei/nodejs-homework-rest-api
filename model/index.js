const crypto = require("crypto");
const DB = require("./db");
const db = require("./contacts.json");
const path = require("path");

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  return await db.read();
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();

    const [result] = contacts.filter((contact) => contact.id === contactId);
    return result;
  } catch (error) {
    return error.message;
  }
};

// const removeContact = async (contactId) => {};

const addContact = async (body) => {
  const contacts = await db.read();
  const newContact = {};
};

const updateContact = async (contactId, body) => {
  const contacts = await db.read();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await db.write(contacts);
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getContactById,
  //   removeContact,
  //   addContact,
  updateContact,
};
