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

// returns {product, page, count, results: [{review_id, ratings, summary, recommend, response, body, data reviewer_name, helpfulness, photos:[{id, url}]}]
// parameters : { page, count, sort, product_id }

const testServer = (req, res) => {
  client.query(`SELECT R.*, COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', P.id, 'url', P.url) ORDER BY P.id) FILTER (WHERE P.id IS NOT NULL), '[]') AS photos FROM reviews R LEFT JOIN reviews_photos P ON R.review_id = P.review_id WHERE R.product_id = ${req.query.product_id} AND R.reported = false GROUP BY R.review_id`, (err, results) => {
    if (err) {
      console.log('query err');
    }
    res.status(200).json({ product: req.query.product_id, page: 0, count: 5, results: results.rows });
    // return re
  })

};

module.exports.testServer = testServer;

