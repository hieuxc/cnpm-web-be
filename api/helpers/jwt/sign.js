const jwt = require('jsonwebtoken')

module.exports = {


  friendlyName: 'Sign',


  description: 'Sign jwt.',


  inputs: {
    user: { type: 'ref', description: 'user information', required: true },
    time: { type: 'number', description: 'Time', defaultsTo: 4320 },
    unit: { type: 'string', description: 'hour, minutes, second', defaultsTo: 'hour' }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },

  sync: true,

  fn: function (inputs, exits) {
    try {
      let { user } = inputs;
      let input = {
        user
      }
      let token = jwt.sign(input, process.env.JWT_SECRET);
      exits.success(token);
    } catch (err) {
      console.log(err)
    }
  }
};