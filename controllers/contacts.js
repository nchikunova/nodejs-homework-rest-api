const Contacts = require('../model/contacts')
const { HttpCode } = require('../service/constants')

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contacts = await Contacts.listContacts(userId, req.query)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        ...contacts,
      },
    })
  } catch (e) {
    next(e)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.getContactById(req.params.contactId, userId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.addContact(userId, req.body)
    return res.status(HttpCode.CREATED).json({
      status: 'Success',
      code: HttpCode.CREATED,
      data: {
        contact,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return next({
        status: HttpCode.BAD_REQUEST,
        message: 'Bad request',
      })
    }
    const userId = req.user.id
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId,
    )
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        data: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const updateContactStatus = async (req, res, next) => {
  // Checking field favorite in validation file as required \\
  // if (!{}.hasOwnProperty.call(req.body, 'favorite')) {
  //   res.status(400).json({
  //     status: 'error',
  //     code: 400,
  //     message: 'Missing field favorite',
  //   })
  //   return
  // }
  try {
    const userId = req.user?.id
    const contact = await Contacts.updateContactStatus(
      userId,
      req.params.contactId,
      req.body,
    )
    if (contact) {
      res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.removeContact(req.params.contactId, userId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact,
        },
      })
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateContactStatus,
  removeContact,
}
