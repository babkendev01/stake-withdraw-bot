require('dotenv').config();
const express = require('express');

const app = express();

const http = require('http');
const config = require('./config');
// Used to track deposit status and update Kafka.
const cronService = require('./services/cron.service');

app.set('config', config);

cronService();

app.server = http.createServer(app);
app.server.listen(config.port, () => {
  console.log(`Server started on ${config.port}`);
  console.log(`Environment is set to ${process.env.NODE_ENV}`);
});

module.exports = app.server;
