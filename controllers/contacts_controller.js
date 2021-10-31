const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../repository/contacts");

const getContacts = async (_req, res, next) => {
  try {
    const contacts = await listContacts();

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

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    console.log(contact);
    console.log(contact.id);

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

const create = async (req, res, next) => {
  try {
    const body = req.body;
    const result = await addContact(body);

    res.json({
      status: "success",
      code: 201,
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (result !== null) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          result,
        },
        message: `Contact deleted!`,
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

const update = async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;

    const result = await updateContact(contactId, body);

    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          result,
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

const updateStatus = async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;

    const result = await updateStatusContact(contactId, body);

    if (result) {
      return res.json({
        status: "success",
        code: 200,
        data: {
          result,
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
  getContacts,
  getById,
  create,
  remove,
  update,
  updateStatus,
};
