const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../repository/contacts");
const { HttpCode } = require("../config/constants");
const { CustomError } = require("../helpers/custom_error");

const getContacts = async (req, res) => {
  const data = await listContacts(req.user._id, req.query);

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

  const contact = await getContactById(contactId, userId);

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
  const result = await addContact({ ...body, owner: userId });

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
  const result = await removeContact(contactId, userId);

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

  const result = await updateContact(contactId, body, userId);

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

const updateStatus = async (req, res) => {
  const userId = req.user._id;
  const body = req.body;
  const { contactId } = req.params;

  const result = await updateStatusContact(contactId, body, userId);

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
