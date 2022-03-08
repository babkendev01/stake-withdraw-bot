// const cronTransactions = require('./cron.transactions');
const cronClaim = require('./cron.claim');

module.exports = async function() {
  // cronTransactions();
  cronClaim();
};
