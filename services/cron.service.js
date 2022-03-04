const cronTransactions = require('./cron.transactions');

module.exports = async function() {
  cronTransactions();
};
