const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts_controller");
const {
  validateContact,
  validateId,
  validateStatusContact,
} = require("./validation");

router.get("/", contactsController.getContacts);

router.get("/:contactId", validateId, contactsController.getById);

router.post("/", validateContact, contactsController.create);

router.delete("/:contactId", validateId, contactsController.remove);

router.put(
  "/:contactId",
  validateId,
  validateContact,
  contactsController.update
);

router.patch(
  "/:contactId/favorite",
  validateId,
  validateStatusContact,
  contactsController.updateStatus
);

module.exports = router;
