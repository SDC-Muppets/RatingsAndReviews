/* eslint-disable no-loop-func */
const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./ReviewsPSQL/reviews.js');
const { getAll } = require('./getAll.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('/test', db.testServer);
app.get('/qa/questions/:id/all/:page', getAll);

app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
