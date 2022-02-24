'use strict';

const { request, response } = require('express'); // eslint-disable-line
const express = require('express');
const cors = require('cors');
const req = require('express/lib/request'); // eslint-disable-line
const axios = require('axios');

const app = express();

app.use(cors());

require('dotenv').config();
const PORT = process.env.PORT || 3002;

// const weatherData = require('./data/weather.json');

app.get('/weather', async (request, response) => {
  try {
    let lat = request.query.lat || 0;
    let lon = request.query.lon || 0;

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&days=3&key=${process.env.WEATHER_API_KEY}`;

    let foundWeather = await axios.get(url);

    // This creates an array with shape [Forecast,Forecast,Forecast]
    // Forecasts has shape {date: String, description: String}
    let parsedWeatherData = foundWeather.data.data.map(forecastData => new Forecast(forecastData));
    response.send(parsedWeatherData);
  } catch (error) {
    error.status = 400;
    error.message = 'Weather data not found';
    throw error;
  }
});

app.get('/movies', async (request, response) => {
  try {
    let searchTerms = request.query.searchTerms;

    // Example URIs
    // https://api.themoviedb.org/3/movie/550?api_key=b5477be6980b760051bcda4412659a7b
    // https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&query=sussy&include_adult=false

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchTerms}&include_adult=false`;

    let movieAPIData = await axios.get(url);

    let movies = movieAPIData.data.results.map(result => new Movie(result));

    response.send(movies);
  } catch (error) {
    error.status = 400;
    error.message = 'Movie data not found';
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

class Movie {
  constructor(data){
    this.title = data.title;
    this.overview = data.overview;
    this.vote_average = data.vote_average;
    this.vote_count = data.vote_count;
    this.image_url = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    this.popularity = data.popularity;
    this.release_date = data.release_date;
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
