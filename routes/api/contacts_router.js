const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts_controller");
const { validateContact } = require("./validation");

router.get("/", contactsController.listContacts);

router.get("/:contactId", contactsController.getContactById);

router.post("/", validateContact, contactsController.addContact);

router.delete("/:contactId", contactsController.removeContact);

router.put("/:contactId", validateContact, contactsController.updateContact);

module.exports = router;
