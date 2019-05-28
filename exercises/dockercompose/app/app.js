const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const svc = require('./service');

module.exports.run = async () => {
  const app = express();
  app.use(bodyParser.json());

  app.get('/', (_, res) => {
    res.send('hello world');
  });

  app.post('/data', async (req, res) => {
    const r = await svc.insert(req.body);
    res.location(`${req.path}/${r.id}`);
    res.end();
  });

  app.get('/data/:id', async (req, res) => {
    const r = await svc.get({ id: req.params.id });
    res.send(r);
  });

  app.delete('/data/:id', async (req, res) => {
    await svc.remove(req.params.id);
    res.status(200);
    res.end();
  });

  const server = http.createServer(app);

  const port = 3000;
  server.listen(port, () =>
    process.stdout.write(`Server is listening on port ${port}\n`)
  );
};
