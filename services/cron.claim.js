const { CronJob } = require('cron');
const BigNumber = require('bignumber.js');
const moment = require('moment');
const config = require('../config');
const { logger } = require('../modules/logger');

const { 
  web3,
  makeFundTransaction,
  makeRetreebClaimTransaction,
  makeRetreebQuickClaimTransaction,
  makeRetreebTransferTransaction,
} = require('../modules/eth');
const { globalValues, contracts } = require('../modules/contracts');

const runTransactions = async () => {
  logger('[runTransactions] start');
  try {
    globalValues.nonce = await web3.eth.getTransactionCount(config.adminAddress);
    globalValues.fundWalletNonce = await web3.eth.getTransactionCount(config.fundWalletAddress);

    await makeFundTransaction(900000000000, globalValues.fundWalletNonce, 200000, config.fundAmount);

    /// /////// retreeb claim and transfer reward
    await makeRetreebClaimTransaction(900000000000, globalValues.nonce, 200000);
    await makeRetreebQuickClaimTransaction(900000000000, globalValues.nonce + 1, 200000);
    const retreebAmount = await contracts.retreeb.methods.balanceOf(config.adminAddress).call();
    await makeRetreebTransferTransaction(900000000000, globalValues.nonce + 2, 200000, config.safeWalletAddress, retreebAmount);
  } catch(err) {
    logger(`[runTransactions] error: ${err}`);
  }
  isRunning = false;
  logger('[runTransactions] end');
};

module.exports = async function() {
  logger('<CRON> transactions started');
  runTransactions();
};
