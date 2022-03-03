/* eslint-disable max-len */
const Web3 = require('web3');
const config = require('../config');

const web3 = new Web3(config.web3Provider);

const masonryAbi = require('../assets/masonry.json');
const tshareAbi = require('../assets/tshare.json');

const addresses = {
  masonry: '0x8764DE60236C5843D9faEB1B638fbCE962773B67',
  tshare: '0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37',
};

const contracts = {};

contracts.masonry = new web3.eth.Contract(
  masonryAbi,
  addresses.masonry
);

contracts.tshare = new web3.eth.Contract(
  tshareAbi,
  addresses.tshare
);

const globalValues = {};

globalValues.nonce = 4;
globalValues.amount = '100000000000000';

module.exports = {
  addresses,
  contracts,
  globalValues,
};
