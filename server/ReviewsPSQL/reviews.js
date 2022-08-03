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
  client.query(`SELECT json_build_object(
    'product_id', ${req.query.product_id},
    'ratings', (select json_build_object('1', (SELECT count(rating) FROM reviews WHERE rating = 1 AND product_id = ${req.query.product_id}), '2', (SELECT count(rating) FROM reviews WHERE rating = 2 AND product_id = ${req.query.product_id}), '3', (SELECT count(rating) FROM reviews WHERE rating = 3 AND product_id = ${req.query.product_id}), '4', (SELECT count(rating) FROM reviews WHERE rating = 4 AND product_id = ${req.query.product_id}), '5', (SELECT count(rating) FROM reviews WHERE rating = 5 AND product_id = ${req.query.product_id}))),
    'recommended', (SELECT json_build_object('true', (SELECT count(recommend) FROM reviews WHERE recommend = true AND product_id = 4), 'false', (SELECT count(recommend) FROM reviews WHERE recommend = false AND product_id = ${req.query.product_id}))),
    'characteristics', (SELECT json_build_object(
      'Fit', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Fit'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Fit'))::decimal(5, 4))),
      'Length', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Length'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Length'))::decimal(5, 4))),
      'Comfort', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Comfort'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Comfort'))::decimal(5, 4))),
      'Quality', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Quality'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Quality'))::decimal(5, 4))),
      'Width', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Width'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Width'))::decimal(5, 4))),
      'Size', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Size'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = ${req.query.product_id} AND name = 'Size'))::decimal(5, 4)))
    ))
  )`, (err, results) => {
    if (err) {
      console.log('get meta err', err);
    }
    res.status(200).json(results.rows[0]['json_build_object']);
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
  client.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${req.query.review_id}`, (err) => {
    if (err) {
      console.log('mark helpful err', err);
    }
    res.sendStatus(200);
  });
};

const addReview = (req, res) => {
  console.log(req.body);
  console.log(JSON.stringify(req.body));
  client.query(`
  WITH insert_review AS (
    INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reported, name, email, response, helpfulness)
    SELECT (${req.body.product_id}::integer), (${req.body.rating}::integer), (CURRENT_DATE::text), ('${req.body.summary}'::text), ('${req.body.body}'::text), ${req.body.recommend}, false, ('${req.body.name}'::text), ('${req.body.email}'::text), NULL, 0
    RETURNING review_id
  ), insert_photos AS (
    INSERT INTO reviews_photos(review_id, url)
    SELECT (SELECT review_id FROM insert_review), json_array_elements('${JSON.stringify(req.body.photos)}')
    RETURNING review_id
  ) INSERT INTO characteristic_reviews(characteristic_id, review_id, value)
  SELECT key_obj.key::integer, (SELECT review_id FROM insert_review), key_obj.value::integer
  FROM (SELECT * FROM JSON_EACH_TEXT('${JSON.stringify(req.body.characteristics)}')) key_obj`, (err, results) => {
    if (err) {
      console.log('add review err', err);
    }
    res.sendStatus(200);
  });
};

module.exports = { getReviews, getMeta, reportReview, markHelpful, addReview };

// getMeta

// // characteristics
// SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Fit'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Fit'))::decimal(5, 4));

// SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Length'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Length'))::decimal(5, 4));

// SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Comfort'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Comfort'))::decimal(5, 4));

// SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Quality'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Quality'))::decimal(5, 4));

// SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Width'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Width'))::decimal(5, 4));

// SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Size'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Size'))::decimal(5, 4));

// // recommend
// SELECT json_build_object('true', (SELECT count(recommend) FROM reviews WHERE recommend = true AND product_id = 4), 'false', (SELECT count(recommend) FROM reviews WHERE recommend = false AND product_id = 4));

// // rating
// select json_build_object('1', (SELECT count(rating) FROM reviews WHERE rating = 1 AND product_id = 4), '2', (SELECT count(rating) FROM reviews WHERE rating = 2 AND product_id = 4), '3', (SELECT count(rating) FROM reviews WHERE rating = 3 AND product_id = 4), '4', (SELECT count(rating) FROM reviews WHERE rating = 4 AND product_id = 4), '5', (SELECT count(rating) FROM reviews WHERE rating = 5 AND product_id = 4));

// SELECT json_build_object(
//   'product_id', 4,
//   'ratings', (select json_build_object('1', (SELECT count(rating) FROM reviews WHERE rating = 1 AND product_id = 4), '2', (SELECT count(rating) FROM reviews WHERE rating = 2 AND product_id = 4), '3', (SELECT count(rating) FROM reviews WHERE rating = 3 AND product_id = 4), '4', (SELECT count(rating) FROM reviews WHERE rating = 4 AND product_id = 4), '5', (SELECT count(rating) FROM reviews WHERE rating = 5 AND product_id = 4))),
//   'recommended', (SELECT json_build_object('true', (SELECT count(recommend) FROM reviews WHERE recommend = true AND product_id = 4), 'false', (SELECT count(recommend) FROM reviews WHERE recommend = false AND product_id = 4))),
//   'characteristics', (SELECT json_build_object(
//     'Fit', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Fit'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Fit'))::decimal(5, 4))),
//     'Length', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Length'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Length'))::decimal(5, 4))),
//     'Comfory', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Comfort'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Comfort'))::decimal(5, 4))),
//     'Quality', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Quality'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Quality'))::decimal(5, 4))),
//     'Width', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Width'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Width'))::decimal(5, 4))),
//     'Size', (SELECT json_build_object('id', (SELECT id from characteristics where product_id = 4 AND name = 'Size'), 'value', (SELECT AVG(VALUE) FROM characteristic_reviews where characteristic_id = (SELECT id from characteristics where product_id = 4 AND name = 'Size'))::decimal(5, 4)))
//   ))
// )