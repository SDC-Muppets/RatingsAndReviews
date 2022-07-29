// want to create queries to return correct objects
const pg = require('pg');
const client = new pg.Client({
  host: 'localhost',
  database: 'sdc',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.log('err');
  }
  console.log('connected');
});

const testServer = (req, res) => {
  client.query('SELECT * FROM reviews LIMIT 5', (err, results) => {
    if (err) {
      console.log('query err');
    }
    res.status(200).json(results.rows);
  })
}
module.exports.testServer = testServer;