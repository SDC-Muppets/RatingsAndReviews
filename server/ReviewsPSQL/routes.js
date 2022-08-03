require('dotenv').config();
const routes = require('express').Router();
const db = require('./reviews.js');

routes.get('/', (req, res) => {
  db.getReviews(req.query.product_id)
  .then((data) => {
    res.status(200).json({
      product: req.query.product_id,
      page: req.query.page || 0,
      count: req.query.count || 5,
      results: data.rows
    });
  })
  .catch((err) => {
    console.log('error in get reviews', err);
  })
});

routes.get('/meta', (req, res) => {
  db.getMeta(req.query.product_id)
  .then((data) => {
    res.status(200).json(data.rows[0]['json_build_object']);
  })
  .catch((err) => {
    console.log('error in get meta', err);
  })
});

routes.put('/report', (req, res) => {
  db.reportReview(req.query.review_id)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log('error in report', err);
  })
});

routes.put('/helpful', (req, res) => {
  db.markHelpful(req.query.review_id)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log('error in helpful', err);
  })
});

routes.post('/', (req, res) => {
  db.addReview(req)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log('error in post', err);
  })
});
module.exports = routes;