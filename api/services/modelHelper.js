const moment = require('moment');

var func = {};
func.generateDigitCode = (length) => {
  length = Math.max(length, 6);
  let dateFactor = moment().diff(moment(new Date(2018, 0, 0, 0, 0, 0, 0)), 'milliseconds');
  let randomFator = ('000' + Math.round(Math.random() * 1000)).slice(-3);
  return ('000' + dateFactor).slice(-((length || 15) - 3)) + randomFator;
}
module.exports = func;