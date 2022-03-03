const cronTransactions = require('./cron.transactions');
const cronFetch = require('./cron.fetch');

module.exports = async function() {
  cronTransactions();
  // cronFetch();
};
