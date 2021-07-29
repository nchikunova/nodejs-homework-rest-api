const express = require('express')
const router = express.Router()
const { validateAuth, validateUpdateSub } = require('../../service/validation')
const userController = require('../../controllers/users')
const guard = require('../../service/guard')

router
  .post('/signup', validateAuth, userController.signup)
  .post('/login', validateAuth, userController.login)
  .post('/logout', guard, userController.logout)
  .get('/current', guard, userController.currentUser)
  .patch('/', guard, validateUpdateSub, userController.updateSub)

module.exports = router
