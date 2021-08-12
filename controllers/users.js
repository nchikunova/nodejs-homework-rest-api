const jwt = require('jsonwebtoken')
const Users = require('../model/users')
const fs = require('fs/promises')
const path = require('path')
const { HttpCode } = require('../services/constants')
const UploadAvatarService = require('../services/local-upload')
const EmailService = require('../services/email')
const CreateSenderSendGrid = require('../services/email-sender')

require('dotenv').config()
const { SECRET_KEY } = process.env

const signup = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
      return next({
        status: HttpCode.CONFLICT,
        message: 'This email is already in use',
      })
    }
    const newUser = await Users.create(req.body)
    try {
      const emailService = new EmailService(process.env.NODE_ENV, new CreateSenderSendGrid())
      await emailService.sendVerifyEmail(newUser.verifyToken, newUser.email)
    } catch (error) {
      console.log(error.message)
    }

    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
          avatarURL: newUser.avatarURL,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user.validPassword(password)
    if (!user || !isValidPassword || !user.isVerified) {
      return next({
        status: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      })
    }
    const id = user.id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(id, token)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const logout = async (req, res, next) => {
  const { id, email } = req.user
  console.log('🚀 ~ file: users.js ~ line 66 ~ logout ~ email', email)
  await Users.updateToken(id, null)
  return res.sendStatus(HttpCode.NO_CONTENT)
}

const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user
    console.log('🚀 ~ file: users.js ~ line 74 ~ currentUser ~ email', email)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email,
          subscription,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateSub = async (req, res, next) => {
  const { id } = req.user
  const { subscription } = req.body
  try {
    await Users.updateSubUser(id, subscription)
    const user = await Users.findById(id)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateAvatar = async (req, res, next) => {
  try {
    const { id } = req.user
    const uploads = new UploadAvatarService('avatars')
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file })
    console.log(
      '🚀 ~ file: users.js ~ line 121 ~ updateAvatar ~ avatarUrl',
      req.user.avatarURL,
    )

    try {
      await fs.unlink(path.join('public', req.user.avatarURL))
      console.log(
        '🚀 ~ file: users.js ~ line 125 ~ updateAvatar ~ "public", req.user.avatarURL',
        'public',
        req.user.avatarURL,
      )
    } catch (e) {
      console.log(
        '🚀 ~ file: users.js ~ line 127 ~ updateAvatar ~ error',
        e.message,
      )
    }

    await Users.updateAvatar(id, avatarUrl)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarUrl },
    })
  } catch (e) {
    next(e)
  }
}

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verificationToken)
    if (user) {
      await Users.updateTokenVerify(user.id, true, null)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful'
      })
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'User not found'
      })
  } catch (error) {
    next(error)
  }
}

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      const { isVerified, verifyToken, email } = user

      if (!isVerified) {
        const emailService = new EmailService(process.env.NODE_ENV, new CreateSenderSendGrid())
        await emailService.sendVerifyEmail(verifyToken, email)
        return res.json({
          status: 'success',
          code: HttpCode.OK,
          data: {
            message: 'Verification email sent'
          },
        })
      }

      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Verification has already been passed',
      })
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateSub,
  updateAvatar,
  verify,
  repeatEmailVerification
}
