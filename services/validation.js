const Joi = require('joi')
const { HttpCode } = require('./constants')

const schemaValidateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/)
    .required(),
  favorite: Joi.boolean().default(false),
})

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^[(][\d]{3}[)]\s[\d]{3}[-][\d]{4}/)
    .optional(),
  favorite: Joi.boolean().default(false),
})

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().default(false).required(),
})

const schemaValidateAuth = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
})

const schemaValidateUpdateSub = Joi.object({
  subscription: Joi.any().valid('starter', 'pro', 'business').required(),
})

const schemaRepeatVerificated = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
})

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
    })
  }
  next()
}

module.exports = {
  validateContact: (req, _res, next) => {
    return validate(schemaValidateContact, req.body, next)
  },
  validateAuth: (req, _res, next) => {
    return validate(schemaValidateAuth, req.body, next)
  },
  validateUpdateSub: (req, _res, next) => {
    return validate(schemaValidateUpdateSub, req.body, next)
  },
  updateValidateContact: (req, _res, next) => {
    return validate(schemaUpdateContact, req.body, next)
  },
  validateUpdateStatus: (req, _res, next) => {
    return validate(schemaUpdateStatusContact, req.body, next)
  },
  schemaRepeatVerificated: (req, _res, next) => {
    return validate(schemaRepeatVerificated, req.body, next)
  },
}
