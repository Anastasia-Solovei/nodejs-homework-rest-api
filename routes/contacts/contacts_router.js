const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts_controller");
const {
  validateContact,
  validateId,
  validateStatusContact,
} = require("./validation");
const guard = require("../../helpers/guard");
const wrapError = require("../../helpers/error_handler");

router.get("/", guard, wrapError(contactsController.getContacts));

router.get(
  "/:contactId",
  guard,
  validateId,
  wrapError(contactsController.getById)
);

router.post("/", guard, validateContact, wrapError(contactsController.create));

router.delete(
  "/:contactId",
  guard,
  validateId,
  wrapError(contactsController.remove)
);

router.put(
  "/:contactId",
  guard,
  validateId,
  validateContact,
  wrapError(contactsController.update)
);

router.patch(
  "/:contactId/favorite",
  guard,
  validateId,
  validateStatusContact,
  wrapError(contactsController.updateStatus)
);

module.exports = router;
