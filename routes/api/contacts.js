const express = require('express')
const router = express.Router()
const contactsController = require('../../controllers/contacts')
const {
  validateContact,
  updateValidateContact,
  validateUpdateStatus,
} = require('../../service/validation')
const guard = require('../../service/guard')

router
  .get('/', guard, contactsController.listContacts)
  .post('/', guard, validateContact, contactsController.addContact)

router
  .get('/:contactId', guard, contactsController.getContactById)
  .delete('/:contactId', guard, contactsController.removeContact)
  .patch(
    '/:contactId',
    guard,
    updateValidateContact,
    contactsController.updateContact,
  )
  .patch(
    '/:contactId/favorite',
    guard,
    validateUpdateStatus,
    contactsController.updateContactStatus,
  )

module.exports = router
