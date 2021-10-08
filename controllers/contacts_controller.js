const { ObjectId } = require("mongodb");
const db = require("../model/db");

const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

const listContacts = async (_req, res, next) => {
  try {
    const collection = await getCollection(db, "contacts");
    const contacts = await collection.find({}).toArray();

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
    const collection = await getCollection(db, "contacts");
    const oid = new ObjectId(contactId);
    const [contact] = await collection.find({ _id: oid }).toArray();

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
    const newContact = {
      favorite: false,
      ...body,
    };

    const collection = await getCollection(db, "contacts");
    await collection.insertOne(newContact);

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
    const collection = await getCollection(db, "contacts");
    const oid = new ObjectId(contactId);
    const { value: result } = await collection.findOneAndDelete({ _id: oid });

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

const updateContact = async (req, res, next) => {
  try {
    const body = req.body;
    const { contactId } = req.params;
    const collection = await getCollection(db, "contacts");
    const oid = new ObjectId(contactId);
    const { value: result } = await collection.findOneAndUpdate(
      { _id: oid },
      { $set: body },
      { returnDocument: "after" }
    );

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
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
