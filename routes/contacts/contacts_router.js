const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts_controller");
const {
  validateContact,
  validateId,
  validateStatusContact,
} = require("./validation");
const guard = require("../../helpers/guard");

router.get("/", guard, contactsController.getContacts);

router.get("/:contactId", guard, validateId, contactsController.getById);

router.post("/", guard, validateContact, contactsController.create);

router.delete("/:contactId", guard, validateId, contactsController.remove);

router.put(
  "/:contactId",
  guard,
  validateId,
  validateContact,
  contactsController.update
);

router.patch(
  "/:contactId/favorite",
  guard,
  validateId,
  validateStatusContact,
  contactsController.updateStatus
);

module.exports = router;
