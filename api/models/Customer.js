/**
 * Customer.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
module.exports = {

  attributes: {
    idCustomer: { type: 'string', unique: true },
    phone: { type: 'string', required: true, unique: true },
    password: { type: 'string', required: true },
    name: { type: 'string' },
    email: { type: 'string' },
    birthday: { type: 'ref', columnType: 'datetime' },
    avatar: { type: 'string' },
    address: { type: 'string' },
  },
  beforeCreate: async (valuesToSet, proceed) => {
    let hashedPassword = await sails.helpers.hashPassword(valuesToSet.password)
    if (!hashedPassword) return proceed(err)
    valuesToSet.password = hashedPassword
    valuesToSet.idCustomer = modelHelper.generateDigitCode(8)
    return proceed();
  },
};

