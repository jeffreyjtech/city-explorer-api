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
  let parsedWeatherData = {};
  if(foundWeather){
    parsedWeatherData = foundWeather.data.map(forecastData => new Forecast(forecastData));
  }

  response.send(parsedWeatherData);
});

app.get('*', (request, response) => {
  response.send('You dun goofed');
});

class Forecast {
  constructor(data){
    this.date = data.datetime;
    this.description = `Low of ${data.low_temp}, high of ${data.high_temp} with ${data.weather.description.toLowerCase()}.`;
  }
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
