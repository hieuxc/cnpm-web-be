/**
 * ServiceOrder.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idServiceOrder: { type: 'string', required: true },
    idCustomer: { type: 'string', required: true },
    nameService: { type: 'string', required: true },
    nameCustomer: { type: 'string', required: true },
    address: { type: 'string', required: true },
    time: { type: 'ref', columnType: 'datetime' },
    price: { type: 'number', required: true },
    promoPrice: { type: 'number', required: true },
  },

};

