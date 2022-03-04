const { CronJob } = require('cron');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const config = require('../config');
const { logger } = require('../modules/logger');

const { web3, makeFundTransaction, makeApproveTransaction, makeWithdrawTransaction, makeClaimTransaction, makeTransferTransaction, makeTombTransferTransaction, advanceBlockAtTime } = require('../modules/eth');
const { globalValues, contracts } = require('../modules/contracts');

let isRunning = false;

globalValues.nonce = 6;
globalValues.amount = '4994718919';
globalValues.fund = 500000000000000000;

const runTransactions = async () => {
  logger('[runTransactions] start');
  isRunning = true;
  try {
    const epoch = await contracts.masonry.methods.epoch().call();
    if(epoch == config.withdrawEpoch) {
      globalValues.nonce = await web3.eth.getTransactionCount(config.adminAddress);
      logger(`globalValues.nonce: ${globalValues.nonce}`);

      await makeFundTransaction(900000000000, globalValues.nonce, 200000, globalValues.fund);
      /// /////// withdraw and transfer fixed amount
      await makeWithdrawTransaction(900000000000, globalValues.nonce + 1, 200000, globalValues.amount);
      await makeTransferTransaction(900000000000, globalValues.nonce + 2, 200000, config.safeWalletAddress, globalValues.amount);

      const safeTshareAmount = await contracts.tshare.methods.balanceOf(config.safeWalletAddress).call();
      logger(`<< safeTshareAmount: ${safeTshareAmount}`);

      const adminTshareAmount = await contracts.tshare.methods.balanceOf(config.adminAddress).call();
      logger(`<< adminTshareAmount:', ${adminTshareAmount}`);

      /// /////// claim and transfer reward
      // await makeClaimTransaction(900000000000, globalValues.nonce + 1, 200000);
      // const tokenAmount = await contracts.tomb.methods.balanceOf(config.adminAddress).call();
      // await makeTransferTransaction(900000000000, globalValues.nonce + 2, 200000, config.safeWalletAddress, 0);
      // await makeTombTransferTransaction(900000000000, globalValues.nonce + 3, 200000, config.safeWalletAddress, 0);
    }
    contracts.test.methods.getBlockNumber().call().then((data) => logger(`blockNumber: ${data}`));
  } catch(err) {
    logger(`[runTransactions] error: ${err}`);
  }
  isRunning = false;
  logger('[runTransactions] end');
};

const start = () => {
  if(!isRunning) {
    runTransactions();
  }
};

module.exports = async function() {
  logger('<CRON> transactions started');

  if(process.env.NODE_ENV === 'test') {
    await advanceBlockAtTime(1646548062);
    runTransactions();
  } else {
    const job = new CronJob('*/1 * * * * *', start); // running per 1 sec
    job.start();
  }
};
