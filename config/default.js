/* eslint-disable max-len */

const config = {
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  web3Provider: process.env.WEB3_PROVIDER,
  adminPrivateKey: process.env.ADMIN_PRIVATE_KEY,
  adminAddress: process.env.ADMIN_ADDRESS,
  fundWalletPrivateKey: process.env.FUND_WALLET_PRIVATE_KEY,
  fundWalletAddress: process.env.FUND_WALLET_ADDRESS,
  safeWalletAddress: process.env.SAFE_WALLET_ADDRESS,
  predefinedGas: process.env.ADMIN_ADDRESS || 3000000,
  withdrawEpoch: process.env.WITHDRAW_EPOCH || '1062',
  fundAmount: parseFloat(process.env.FUND_AMOUNT || 0.5) * 1e18,
};

module.exports = config;
