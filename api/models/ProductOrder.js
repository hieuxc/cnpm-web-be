/**
 * ProductOrder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idProductOrder: { type: 'string', required: true },
    idCustomer: { type: 'string', required: true },
    name: { type: 'string', required: true },
    address: { type: 'string', required: true },
    totalPrice: { type: 'number', required: true },
    status: { type: 'string', isIn: ['pending', 'delivered', 'cancel'] },
  },

};

