/**
 * Comment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    idObject: { type: 'string', required: true },
    idCustomer: { type: 'string', required: true },
    content: { type: 'string', defaultsTo: '' },
  },

};

