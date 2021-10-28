const Contact = require("../model/contact_schema");

const listContacts = async () => {
  const results = await Contact.find({});
  return results;
};

const getContactById = async (contactId) => {
  const result = await Contact.findById(contactId);
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndRemove({ _id: contactId });
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { favorite: body.favorite },
    { new: true }
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};