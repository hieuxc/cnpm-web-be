/**
 * Cart.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idCustomer: { type: 'string', required: true },
    idProduct: { type: 'string', required: true },
    amount: { type: 'number', defaultsTo: 0 },
  },

};

