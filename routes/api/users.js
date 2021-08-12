const express = require('express')
const router = express.Router()
const { validateAuth, validateUpdateSub, schemaRepeatVerificated } = require('../../services/validation')
const userController = require('../../controllers/users')
const guard = require('../../services/guard')
const multer = require('../../services/multer')

router
  .post('/signup', validateAuth, userController.signup)
  .post('/login', validateAuth, userController.login)
  .post('/logout', guard, userController.logout)

  .get('/current', guard, userController.currentUser)
  .patch('/', guard, validateUpdateSub, userController.updateSub)
  .patch('/avatars', guard, multer.single('avatar'), userController.updateAvatar)

  .get('/verify/:verificationToken', userController.verify)
  .post('/verify', schemaRepeatVerificated, userController.repeatEmailVerification)

module.exports = router
