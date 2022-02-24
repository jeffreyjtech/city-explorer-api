'use strict';

const { request, response } = require('express'); // eslint-disable-line
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request'); // eslint-disable-line

const app = express();

const getWeather = require('./weather.js');
const getMovies = require('./movies.js');

app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT || 3002;


app.get('/weather', getWeather);

app.get('/movies', getMovies);

app.get('*', (request, response) => { // eslint-disable-line
  let newError = new Error;
  newError.status = 404;
  newError.message = 'Resource not found';
  throw newError;
});

app.use((error, request, response, next) => { // eslint-disable-line
  response.status(error.status).send(`${error.status}: ${error.message}`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
