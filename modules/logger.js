const moment = require('moment');

const logger = (log) => {
  console.log(`${moment(+new Date()).local().format('YYYY-MM-DD HH:mm:ss')} ${moment().millisecond()} ${log}`);
};

module.exports = {
  logger
};
