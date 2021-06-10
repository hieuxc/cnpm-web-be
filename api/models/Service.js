/**
 * Service.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idService: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true },
    image: { type: 'string', required: true },
    price: { type: 'number', required: true },
    promoPrice: { type: 'number', defaultsTo: 0 },
    supplier: { type: 'string', required: true },
    address: { type: 'string', required: true },
    description: { type: 'string' },
  },

};

