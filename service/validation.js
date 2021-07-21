const Joi = require('joi')

const schemaCreateContact = Joi.object({
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
  favorite: Joi.boolean().default(false),
})

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 400,
      message,
      data: 'Bad request',
    })
  }
  next()
}

module.exports.createValidateContact = (req, res, next) => {
  return validate(schemaCreateContact, req.body, next)
}
module.exports.updateValidateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
module.exports.validateUpdateStatus = (req, res, next) => {
  return validate(schemaUpdateStatusContact, req.body, next)
}
