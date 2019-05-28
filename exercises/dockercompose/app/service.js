const monk = require('monk');
const uuid = require('uuid');

const host = process.env.MONGO_HOST;
const db = monk(`${host}:27017/cygnilab`);

module.exports.db = db;

const collection = async () => db.get('cygnilab');

module.exports.insert = async data => {
  const id = uuid.v4();
  const col = await collection();
  return col.insert({ id, data });
};

module.exports.remove = async id => {
  const col = await collection();
  return col.remove(id);
};

module.exports.get = async query => {
  const col = await collection();
  const res = col.find(query).then(h =>
    h.map(d => {
      const { id, data } = d;
      return { id, data };
    })
  );
  return res;
};
