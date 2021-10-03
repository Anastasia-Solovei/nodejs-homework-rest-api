const express = require("express");
const router = express.Router();

const { listContacts, getContactById } = require("../../model/index");

router.get("/", async (req, res, next) => {
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
});

router.get("/:contactId", async (req, res, next) => {
  const { id } = req.params;
  getContactById(id)
    .then((contact) =>
      res.json({
        status: "success",
        code: 200,
        data: {
          contact,
        },
      })
    )
    .catch(console.error);
});

router.post("/", async (req, res, next) => {
  try {
  } catch {}
  const { name, email, phone } = req.body;
  //const newContact = { id: crypto.randomUUID(), name, email, phone };
  //contacts.push(newContact);
  res.status(201).json({
    status: "success",
    code: 201,
    // data: {
    //   newContact,
    // },
  });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.patch("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router;
