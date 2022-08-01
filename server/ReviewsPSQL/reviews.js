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

const getReviews = (req, res) => {
  client.query(`SELECT R.review_id, R.rating, R.summary, R.recommend, R.response, R.body, R.date, R.reviewer_name, R.helpfulness, COALESCE(JSON_AGG(JSON_BUILD_OBJECT('id', P.id, 'url', P.url) ORDER BY P.id) FILTER (WHERE P.id IS NOT NULL), '[]') AS photos FROM reviews R LEFT JOIN reviews_photos P ON R.review_id = P.review_id WHERE R.product_id = ${req.query.product_id} AND R.reported = false GROUP BY R.review_id`, (err, results) => {
    if (err) {
      console.log('get reviews err', err);
    }
    res.status(200).json({
      product: req.query.product_id,
      page: req.query.page || 0,
      count: req.query.count || 5,
      results: results.rows
    });
  });
};

const getMeta = (req, res) => {
  client.query(`SELECT JSON_BUILD_OBJECT(rating, COUNT(rating)) as ratings FROM reviews WHERE product_id = ${req.query.product_id} GROUP BY rating`, (err, results) => {
    if (err) {
      console.log('get meta err', err);
    }
    res.status(200).json(results.rows);
  });
};

const reportReview = (req, res) => {
  client.query(`UPDATE reviews SET reported = true WHERE review_id = ${req.query.review_id}`, (err) => {
    if (err) {
      console.log('report review err', err);
    }
    res.sendStatus(200);
  });
};

const markHelpful = (req, res) => {
  client.query(`UPDATE reviews SET helpfulness = helpfullness + 1 WHERE review_id = ${req.query.review_id}`, (err) => {
    if (err) {
      console.log('mark helpful err', err);
    }
    res.sendStatus(200);
  });
};
module.exports = { getReviews, getMeta, reportReview };

update reviews
set helpfulness = helpfulness + 1
where review_id = 8;