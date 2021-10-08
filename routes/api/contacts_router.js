const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts_controller");
const { validateContact, validateId } = require("./validation");

router.get("/", contactsController.listContacts);

router.get(
  "/:contactId",
  // validateId,
  contactsController.getContactById
);

router.post("/", validateContact, contactsController.addContact);

router.delete(
  "/:contactId",
  // validateId,
  contactsController.removeContact
);

router.put(
  "/:contactId",
  // validateId,
  validateContact,
  contactsController.updateContact
);

module.exports = router;
