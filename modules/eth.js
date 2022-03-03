/* eslint-disable no-await-in-loop */
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const config = require('../config');
const { contracts, addresses } = require('./contracts');
const Tx = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common');
const { logger } = require('../modules/logger');

const tshareAbi = require('../assets/tshare.json');

const web3 = new Web3(config.web3Provider);

web3.eth.getChainId().then(data => logger(`chainId: ${data}`));
web3.eth.getBlockNumber().then(data => logger(`blockNumber: ${data}`));

let customCommon;
// if(config.network === 'testnet') {
//   customCommon = Common.default.forCustomChain(
//     'ropsten',
//     {
//       name: 'Chapel',
//       networkId: 97,
//       chainId: 97,
//     },
//     'petersburg',
//   );
// } else {
  customCommon = Common.default.forCustomChain(
    'mainnet',
    {
      name: 'mainnet',
      networkId: 250,
      chainId: 250,
    },
    'petersburg',
  );
// }

let preDefinedGasValue = new BigNumber(config.predefinedGas).dp(0, 2).toNumber();
const privateKey = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');

const sendTransaction = async (provider, data) => {
  try {
    const txHash = await new Promise((resolve, reject) => {
      provider.eth.sendSignedTransaction(data)
        .on('transactionHash', async (hash) => {
          logger(`----- txhash: ${hash}`)
          submittedTrx++;
          return resolve(hash);
        })
        .on('receipt', async (result2) => {
          logger(`----- txrept: ${JSON.stringify(result2)}`)
          return resolve();
        })
        .on('error', async (err) => {
          logger(`----- txfail ${err}`)
          return reject(err);
        });
    });

    return txHash;
  } catch (err) {
    logger('[sendTransaction] error:', err);
  }
  return null;
}

const makeWithdrawTransaction = async (gasPrice, nonce, gas, amount) => {
  logger(`[makeWithdrawTransaction] start`)
  try {
    let contractData = contracts.masonry.methods.withdraw(amount).encodeABI();
    
    const rawTx = {
      from: config.adminAddress,
      to: addresses.masonry,
      data: contractData,
      gasPrice: `0x${gasPrice.toString(16)}`,
      gas: `0x${gas.toString(16)}`,
      value: '0x00',
      nonce: `0x${nonce.toString(16)}`
    };

    const tx = new Tx(rawTx,
      {
      // chain: config.web3Chain,
      // hardfork: config.web3Hardfork
        common: customCommon
      });


    let pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    let serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger(`[makeWithdrawTransaction] end`);
  } catch(err) {
    logger(`[makeWithdrawTransaction] ${err}`);
  }
}

const makeTransferTransaction = async () => {
  logger(`[makeTransferTransaction] start`)
  try {
    let contractData = contracts.tshare.methods.transfer(config.safeWallet, amount).encodeABI();
    
    const rawTx = {
      from: config.adminAddress,
      to: addresses.tshare,
      data: contractData,
      gasPrice: `0x${gasPrice.toString(16)}`,
      gas: `0x${gas.toString(16)}`,
      value: '0x00',
      nonce: `0x${nonce.toString(16)}`
    };

    const tx = new Tx(rawTx,
      {
      // chain: config.web3Chain,
      // hardfork: config.web3Hardfork
        common: customCommon
      });


    let pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    let serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger(`[makeTransferTransaction] end`);
  } catch(err) {
    logger(`[makeTransferTransaction] error: ${err}`);
  }
}

exports.web3 = web3;
exports.makeWithdrawTransaction = makeWithdrawTransaction;
exports.makeTransferTransaction = makeTransferTransaction;
