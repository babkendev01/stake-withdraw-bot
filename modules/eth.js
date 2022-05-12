/* eslint-disable no-await-in-loop */
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const config = require('../config');
const { contracts, addresses, globalValues } = require('./contracts');
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
          logger(`----- txhash: ${hash}`);
          return resolve(hash);
        })
        .on('receipt', async (result2) => {
          logger(`----- txrept: ${JSON.stringify(result2)}`);
          return resolve();
        })
        .on('error', async (err) => {
          logger(`----- txfail ${err}`);
          return reject(err);
        });
    });

    return txHash;
  } catch (err) {
    logger('[sendTransaction] error:', err);
  }
  return null;
};

const makeFundTransaction = async (gasPrice, nonce, gas, value) => {
  logger('[makeFundTransaction] start');
  try {
    const rawTx = {
      from: config.fundWalletAddress,
      to: config.adminAddress,
      gasPrice: `0x${gasPrice.toString(16)}`,
      gas: `0x${gas.toString(16)}`,
      value,
      nonce: `0x${nonce.toString(16)}`
    };

    const tx = new Tx(rawTx,
      {
      // chain: config.web3Chain,
      // hardfork: config.web3Hardfork
        common: customCommon
      });

    const pk = new Buffer.from(config.fundWalletPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeFundTransaction] end');
  } catch(err) {
    logger(`[makeFundTransaction] error: ${err}`);
  }
};

const makeWithdrawTransaction = async (gasPrice, nonce, gas, amount) => {
  logger('[makeWithdrawTransaction] start');
  try {
    const contractData = contracts.masonry.methods.withdraw(amount).encodeABI();

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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeWithdrawTransaction] end');
  } catch(err) {
    logger(`[makeWithdrawTransaction] error: ${err}`);
  }
};

const makeClaimTransaction = async (gasPrice, nonce, gas) => {
  logger('[makeClaimTransaction] start');
  try {
    const contractData = contracts.masonry.methods.claimReward().encodeABI();

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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeClaimTransaction] end');
  } catch(err) {
    logger(`[makeClaimTransaction] error: ${err}`);
  }
};

const makeApproveTransaction = async (gasPrice, nonce, gas, to, amount) => {
  logger('[makeApproveTransaction] start');
  try {
    const contractData = contracts.tshare.methods.approve(to, amount).encodeABI();

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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeApproveTransaction] end');
  } catch(err) {
    logger(`[makeApproveTransaction] error: ${err}`);
  }
};

const makeTransferTransaction = async (gasPrice, nonce, gas, to, amount) => {
  logger('[makeTransferTransaction] start');
  try {
    const contractData = contracts.tshare.methods.transfer(to, amount).encodeABI();

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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeTransferTransaction] end');
  } catch(err) {
    logger(`[makeTransferTransaction] error: ${err}`);
  }
};

const makeTombTransferTransaction = async (gasPrice, nonce, gas, to, amount) => {
  logger('[makeTombTransferTransaction] start');
  try {
    const contractData = contracts.tomb.methods.transfer(to, amount).encodeABI();

    const rawTx = {
      from: config.adminAddress,
      to: addresses.tomb,
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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeTombTransferTransaction] end');
  } catch(err) {
    logger(`[makeTombTransferTransaction] error: ${err}`);
  }
};

const makeRetreebClaimTransaction = async (gasPrice, nonce, gas) => {
  logger('[makeRetreebClaimTransaction] start');
  try {
    const contractData = contracts.retreebDeep.methods.claimRewards().encodeABI();

    const rawTx = {
      from: config.adminAddress,
      to: addresses.retreebDeep,
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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeRetreebClaimTransaction] end');
  } catch(err) {
    logger(`[makeRetreebClaimTransaction] error: ${err}`);
  }
};

const makeRetreebQuickClaimTransaction = async (gasPrice, nonce, gas) => {
  logger('[makeRetreebQuickClaimTransaction] start');
  try {
    const contractData = contracts.retreebQuick.methods.claimRewards().encodeABI();

    const rawTx = {
      from: config.adminAddress,
      to: addresses.retreebQuick,
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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeRetreebQuickClaimTransaction] end');
  } catch(err) {
    logger(`[makeRetreebQuickClaimTransaction] error: ${err}`);
  }
};

const makeQuickPoolWithdrawTransaction = async (gasPrice, nonce, gas) => {
  logger('[makeQuickPoolWithdrawTransaction] start');
  try {
    const contractData = contracts.retreebQuick.methods.withdrawAll().encodeABI();

    const rawTx = {
      from: config.adminAddress,
      to: addresses.retreebQuick,
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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeQuickPoolWithdrawTransaction] end');
  } catch(err) {
    logger(`[makeQuickPoolWithdrawTransaction] error: ${err}`);
  }
};

const makeRetreebTransferTransaction = async (gasPrice, nonce, gas, to, amount) => {
  logger('[makeRetreebTransferTransaction] start');
  try {
    const contractData = contracts.retreeb.methods.transfer(to, amount).encodeABI();

    const rawTx = {
      from: config.adminAddress,
      to: addresses.retreeb,
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

    const pk = new Buffer.from(config.adminPrivateKey.replace('0x', ''), 'hex');
    tx.sign(pk);

    const serializedTx = tx.serialize();
    const serializedData = `0x${serializedTx.toString('hex')}`;

    await sendTransaction(web3, serializedData);
    logger('[makeRetreebTransferTransaction] end');
  } catch(err) {
    logger(`[makeRetreebTransferTransaction] error: ${err}`);
  }
};

const advanceBlockAtTime = (time) => new Promise((resolve, reject) => {
  web3.currentProvider.send(
    {
      jsonrpc: '2.0',
      method: 'evm_mine',
      params: [time],
      id: new Date().getTime(),
    },
    (err) => {
      if(err) {
        return reject(err);
      }
      const newBlockHash = web3.eth.getBlock('latest').hash;

      return resolve(newBlockHash);
    },
  );
});

exports.web3 = web3;
exports.makeFundTransaction = makeFundTransaction;
exports.makeApproveTransaction = makeApproveTransaction;
exports.makeWithdrawTransaction = makeWithdrawTransaction;
exports.makeClaimTransaction = makeClaimTransaction;
exports.makeTransferTransaction = makeTransferTransaction;
exports.makeTombTransferTransaction = makeTombTransferTransaction;
exports.makeRetreebClaimTransaction = makeRetreebClaimTransaction;
exports.makeRetreebQuickClaimTransaction = makeRetreebQuickClaimTransaction;
exports.makeQuickPoolWithdrawTransaction = makeQuickPoolWithdrawTransaction;
exports.makeRetreebTransferTransaction = makeRetreebTransferTransaction;
exports.advanceBlockAtTime = advanceBlockAtTime;
