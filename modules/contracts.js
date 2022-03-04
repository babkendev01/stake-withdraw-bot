/* eslint-disable max-len */
const Web3 = require('web3');
const config = require('../config');

const web3 = new Web3(config.web3Provider);

const masonryAbi = require('../assets/masonry.json');
const tshareAbi = require('../assets/tshare.json');
const tombAbi = require('../assets/tomb.json');
const testAbi = require('../assets/test.json');

const addresses = {
  test: '0x2E8f05A0C3220341Cec6B18d558789fcA2204f6E',
  masonry: '0x8764DE60236C5843D9faEB1B638fbCE962773B67',
  tshare: '0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37',
  tomb: '0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7',
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

contracts.tomb = new web3.eth.Contract(
  tombAbi,
  addresses.tomb
);

contracts.test = new web3.eth.Contract(
  testAbi,
  addresses.test
);

const globalValues = {};

globalValues.nonce = 6;
globalValues.amount = '100000000000000';

module.exports = {
  addresses,
  contracts,
  globalValues,
};
