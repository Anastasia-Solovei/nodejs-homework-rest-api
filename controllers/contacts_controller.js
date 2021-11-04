const Contacts = require("../repository/contacts");
const { HttpCode } = require("../config/constants");
const { CustomError } = require("../helpers/custom_error");

const getContacts = async (req, res) => {
  const data = await Contacts.listContacts(req.user._id, req.query);

  res.status(HttpCode.OK).json({
    status: "success",
    code: HttpCode.OK,
    data: {
      ...data,
    },
  });
};

const getById = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await Contacts.getContactById(contactId, userId);

  if (contact) {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        contact,
      },
    });
  }

  throw new CustomError(HttpCode.NOT_FOUND, "Not found!");
  // return res.status(HttpCode.NOT_FOUND).json({
  //   status: "error",
  //   code: HttpCode.NOT_FOUND,
  //   message: "Not found!",
  // });
};

const create = async (req, res) => {
  const userId = req.user._id;
  const body = req.body;
  const result = await Contacts.addContact({ ...body, owner: userId });

  res.status(HttpCode.CREATED).json({
    status: "success",
    code: HttpCode.CREATED,
    data: {
      result,
    },
  });
};

const remove = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const result = await Contacts.removeContact(contactId, userId);

  if (result !== null) {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        result,
      },
      message: `Contact deleted!`,
    });
  }

  throw new CustomError(HttpCode.NOT_FOUND, "Not found!");
  // return res.status(HttpCode.NOT_FOUND).json({
  //   status: "error",
  //   code: HttpCode.NOT_FOUND,
  //   message: "Not found!",
  // });
};

const update = async (req, res) => {
  const userId = req.user._id;
  const body = req.body;
  const { contactId } = req.params;

  const contact = await Contacts.updateContact(contactId, body, userId);
  console.log(contact);

  if (contact) {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        contact,
      },
    });
  }

  throw new CustomError(HttpCode.NOT_FOUND, "Not found!");
  // return res.status(HttpCode.NOT_FOUND).json({
  //   status: "error",
  //   code: HttpCode.NOT_FOUND,
  //   message: "Not found",
  // });
};

const updateStatus = async (req, res) => {
  const userId = req.user._id;
  const body = req.body;
  const { contactId } = req.params;

  const result = await Contacts.updateStatusContact(contactId, body, userId);

  if (result) {
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        result,
      },
    });
  }

  throw new CustomError(HttpCode.NOT_FOUND, "Not found!");
  // return res.status(HttpCode.NOT_FOUND).json({
  //   status: "error",
  //   code: HttpCode.NOT_FOUND,
  //   message: "Not found",
  // });
};

module.exports = {
  getContacts,
  getById,
  create,
  remove,
  update,
  updateStatus,
};
