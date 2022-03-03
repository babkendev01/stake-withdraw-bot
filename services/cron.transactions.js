const { CronJob } = require('cron');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const config = require('../config');
const { logger } = require('../modules/logger');

const { web3, makeLiquidateBorrowTransaction } = require('../modules/eth');

let isRunning = false;

const runTransactions = () => {
  isRunning = true;
  isRunning = false;
}

const start = () => {
  if(isRunning) {
    runTransactions();
  }
}

module.exports = async function() {
  const job = new CronJob('*/1 * * * * *', start); // running per 1 mins
  job.start();
};
