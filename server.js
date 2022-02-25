'use strict';

require('dotenv');
const express = require('express');
const cors = require('cors'); // eslint-disable-line
const app = express();

app.use(cors());

const getWeather = require('./modules/weather.js');
const getMovies = require('./modules/movies.js');

require('dotenv').config();
const PORT = process.env.PORT || 3002;

app.get('/weather', weatherHandler);

app.get('/movies', getMovies);

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
    .then((summaries) => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(200).send('Sorry. Something went wrong!');
    });
}

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
