/**
 * Admin.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idAdmin: { type: 'string', required: true },
    phone: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
    name: { type: 'string' },
    email: { type: 'string' },
  },
  beforeCreate: async (valuesToSet, proceed) => {
    let hashedPassword = await sails.helpers.hashPassword(valuesToSet.password)
    if (!hashedPassword) return proceed(err)
    valuesToSet.password = hashedPassword
    valuesToSet.idAdmin = modelHelper.generateDigitCode(8)
    return proceed();
  },
}

