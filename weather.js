'use strict';

const axios = require('axios');

function errorResponse(error, request, response) {
  error.status = error.status || 400;
  error.message = `Error on request with route ${request.route.path || 'unknown'}: ${error.message}`;
  response.status(error.status).send(`${error.message}`);
}

async function getWeather(request, response) {
  try {
    let lat = request.query.lat;
    let lon = request.query.lon;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=3&key=${process.env.WEATHER_API_KEY}`;

    let foundWeather = await axios.get(url);

    // This creates an array with shape [Forecast,Forecast,Forecast]
    // Forecasts has shape {date: String, description: String}
    let parsedWeatherData = foundWeather.data.data.map(forecastData => new Forecast(forecastData));
    response.send(parsedWeatherData);
  } catch (error) {
    errorResponse(error, request, response);
  }
}

class Forecast {
  constructor(data){
    this.date = data.datetime;
    this.description = `Low of ${data.low_temp}, high of ${data.high_temp} with ${data.weather.description.toLowerCase()}.`;
  }
}

module.exports = getWeather;
