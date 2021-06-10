const jwt = require('jsonwebtoken')

module.exports = {


  friendlyName: 'Verify',


  description: 'Verify jwt.',


  inputs: {
    token: { type: 'string', description: 'token verify', required: true }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },

  sync: true,
  fn: function (inputs, exits) {
    let { token } = inputs;
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET);
      return exits.success(decoded.user);
    } catch (err) {
      console.log(err);
    }
  }
};