const http = require('http');
const express = require('express');

module.exports.run = () => {
  const app = express();

  app.get('/', (_, res) => {
    res.send('hello world');
  });

  app.get('/pong', (req, res) => {
    console.log("ponged")
    setTimeout(() => {
      http.get('http://cygni-docker-lab-1:3000/ping');
      res.send('ping pong has begun!');
    }, 5000);
  });

  const server = http.createServer(app);

  const port = 3001;
  server.listen(port, () =>
    process.stdout.write(`Pong Server is listening on port ${port}\n`)
  );
};
