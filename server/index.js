/* eslint-disable no-loop-func */
const express = require('express');
const path = require('path');
require('dotenv').config();
const { getAll } = require('./getAll.js');
const routes = require('./ReviewsPSQL/routes.js');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.use('/reviews', routes);
// app.get('/reviews', db.getReviews);
// app.get('/reviews/meta', db.getMeta);
// app.put('/reviews/report', db.reportReview);
// app.put('/reviews/helpful', db.markHelpful);
// app.post('/reviews', db.addReview);

app.get('/qa/questions/:id/all/:page', getAll);

app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
