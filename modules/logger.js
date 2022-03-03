const moment = require('moment');
const winston = require('winston');

const logger = (log) => {
  winston.info(`${moment(+new Date()).local().format('YYYY-MM-DD HH:mm:ss')} ${moment().millisecond()} ${log}`);
};

module.exports = {
  logger
};
