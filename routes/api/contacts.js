const express = require('express')
const router = express.Router()
const contactsController = require('../../controller')
const {
  createValidateContact,
  updateValidateContact,
  validateUpdateStatus,
} = require('../../service/validation')

router
  .get('/', contactsController.listContacts)
  .post('/', createValidateContact, contactsController.addContact)
  .get('/:contactId', contactsController.getContactById)
  .delete('/:contactId', contactsController.removeContact)
  .patch('/:contactId', updateValidateContact, contactsController.updateContact)
  .patch(
    '/:contactId/favorite',
    validateUpdateStatus,
    contactsController.updateContactStatus,
  )

module.exports = router
