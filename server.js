'use strict';

const { request, response } = require('express'); // eslint-disable-line
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request'); // eslint-disable-line

const app = express();

app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT || 3002;

const weatherData = require('./data/weather.json');

app.get('/weather', (request, response) => {
  // let lat = request.query.lat;
  // let lon = request.query.lon;
  let searchQuery = request.query.searchQuery;
  console.log('I was pinged!');

  let foundWeather = weatherData.find(city => city.city_name === searchQuery);
  try {
    let parsedWeatherData = foundWeather.data.map(forecastData => new Forecast(forecastData));
    response.send(parsedWeatherData);
  } catch (error) {
    error.status = 500;
    error.message = 'Weather data not found';
    throw error;
  }
});

app.get('*', (request, response) => { // eslint-disable-line
  let newError = new Error;
  newError.status = 404;
  newError.message = 'Resource not found';
  throw newError;
});

class Forecast {
  constructor(data){
    this.date = data.datetime;
    this.description = `Low of ${data.low_temp}, high of ${data.high_temp} with ${data.weather.description.toLowerCase()}.`;
  }
}

// Error response using .status()
// response.status(400).send({
//   message: 'This is an error!'
// });

app.use((error, request, response, next) => { // eslint-disable-line
  response.status(error.status).send(`${error.status}: ${error.message}`);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
