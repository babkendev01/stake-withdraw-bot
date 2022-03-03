const { CronJob } = require('cron');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const config = require('../config');
const { logger } = require('../modules/logger');

const { web3 } = require('../modules/eth');
const { globalValues, contracts } = require('../modules/contracts');

let isRunning = false;

const runFetch = async () => {
  logger('[runFetch] start');
  isRunning = true;
  try {
    globalValues.nonce = await web3.eth.getBlockNumber();
    globalValues.amount = await contracts.masonry.balanceOf(config.adminAddress).call();
    console.log('globalValues:', globalValues);
  } catch(err) {
    logger(`[runFetch] error: ${err}`);
  }
  isRunning = false;
  logger('[runFetch] end');
};

const start = () => {
  if(isRunning) {
    runFetch();
  }
};

module.exports = async function() {
  logger('<CRON> fetch started');
  const job = new CronJob('*/1 * * * * *', start); // running per 1 sec
  job.start();
  globalValues.nonce = 4;
  globalValues.amount = '100000000000000';
};
