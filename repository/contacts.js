const Contact = require("../model/contact_schema");

const listContacts = async (userId, query) => {
  const { limit = 20, page = 1, favorite = null } = query;
  const searchOptions = { owner: userId };

  if (favorite !== null) {
    searchOptions.favorite = favorite;
  }

  const results = await Contact.paginate(searchOptions, {
    limit,
    page,
    populate: {
      path: "owner",
      select: "email subscription createdAt updatedAt",
    },
  });
  const { docs: contacts } = results;
  delete results.docs;
  return { ...results, contacts };
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "email subscription createdAt updatedAt",
  });

  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

const updateStatusContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
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
