const jwt = require('jsonwebtoken')
const Users = require('../model/users')
const { HttpCode } = require('../service/constants')
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
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
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
    if (!user || !isValidPassword) {
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
  console.log('=== logout ===', email)
  await Users.updateToken(id, null)
  return res.sendStatus(HttpCode.NO_CONTENT)
}

const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user
    console.log('=== current user ===', email)
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

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateSub,
}
