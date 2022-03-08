/* eslint-disable max-len */
const Web3 = require('web3');
const config = require('../config');

const web3 = new Web3(config.web3Provider);

const masonryAbi = require('../assets/masonry.json');
const tshareAbi = require('../assets/tshare.json');
const tombAbi = require('../assets/tomb.json');
const testAbi = require('../assets/test.json');
const retreebStakingAbi = require('../assets/retreebStaking.json');
const retreebAbi = require('../assets/retreeb.json');

const addresses = {
  test: '0x2E8f05A0C3220341Cec6B18d558789fcA2204f6E',
  masonry: '0x8764DE60236C5843D9faEB1B638fbCE962773B67',
  tshare: '0x4cdF39285D7Ca8eB3f090fDA0C069ba5F4145B37',
  tomb: '0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7',
  retreebQuick: '0x669b6723D8cf1cE664bc1005646a26Dc8563E5C7',
  retreebDeep: '0x5fA057966fB12c9e89bF603661CE3133bD3CBf8B',
  retreeb: '0xc60D7067dfBc6f2caf30523a064f416A5Af52963',
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

contracts.retreebDeep = new web3.eth.Contract(
  retreebStakingAbi,
  addresses.retreebDeep
);

contracts.retreebQuick = new web3.eth.Contract(
  retreebStakingAbi,
  addresses.retreebQuick
);

contracts.retreeb = new web3.eth.Contract(
  retreebAbi,
  addresses.retreeb
);

const globalValues = {};

module.exports = {
  addresses,
  contracts,
  globalValues,
};
