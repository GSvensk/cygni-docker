const http = require('http');
const express = require('express');
const os = require('os');

module.exports.run = () => {
  const app = express();

  const host = os.hostname();

  app.get('/', (_, res) => {
    res.send('hello world');
  });

  app.get('/host', (_, res) => {
    res.send(`I'm running on host ${host}`);
  });

  const server = http.createServer(app);

  const port = 3000;
  server.listen(port, () =>
    process.stdout.write(`Server is listening on port ${port}\n`)
  );
};
