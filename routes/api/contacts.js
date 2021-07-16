const express = require('express')
const router = express.Router()
const Contacts = require('../../model')
const validate = require('../../validation/contacts')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
    return res.json({
      status: 'success',
      code: 200,
      message: 'Contacts found',
      data: {
        contacts,
      },
    })
  } catch (e) {
    next(e)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact found',
        data: {
          contact
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found'
      })
    }
  } catch (e) {
    next()
  }
})

router.post('/', validate.createContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body)
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Contact created',
      data: {
        contact
      },
    })
  } catch (e) {
    next(e)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact deleted',
        data: {
          contact,
        }
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
})

router.patch('/:contactId', validate.updateContact, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Bad request',
      })
    }
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    )
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        message: 'Contact updated',
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router
