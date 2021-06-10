/**
 * ProductOrderDetail.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idProductOrder: { type: 'string', required: true },
    idProduct: { type: 'string', required: true },
    name: { type: 'string', required: true },
    price: { type: 'number', required: true },
    promoPrice: { type: 'number', required: true },
    amount: { type: 'number', required: true},
  },

};

