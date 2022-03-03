const { CronJob } = require('cron');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const config = require('../config');
const { logger } = require('../modules/logger');

const { makeWithdrawTransaction, makeTransferTransaction, advanceBlockAtTime } = require('../modules/eth');
const { globalValues, contracts } = require('../modules/contracts');

let isRunning = false;

const runTransactions = async () => {
  logger('[runTransactions] start');
  isRunning = true;
  await makeWithdrawTransaction(900000000, globalValues.nonce, 2000000, globalValues.amount);
  await makeTransferTransaction(900000000, globalValues.nonce + 1, 2000000);
  logger(`safe wallet amount: ${await contracts.tshare.methods.balanceOf(config.safeWalletAddress).call()}`);
  isRunning = false;
  logger('[runTransactions] end');
};

const start = () => {
  if(isRunning) {
    runTransactions();
  }
};

module.exports = async function() {
  logger('<CRON> transactions started');

  if(process.env.NODE_ENV === 'test') {
    await advanceBlockAtTime(1646548062);
    runTransactions();
  } else {
    const job = new CronJob('*/1 * * * * *', start); // running per 1 mins
    job.start();
  }
};
