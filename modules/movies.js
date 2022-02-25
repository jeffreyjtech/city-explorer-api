'use strict';

const axios = require('axios');

const errorResponse = require('./error.js');

let cache = require('./cache.js');

async function getMovies(request, response) {
  try {
    let searchTerms = request.query.searchTerms;

    if (!searchTerms) throw new Error('Invalid query');

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchTerms}&include_adult=false`;

    if (
      cache[searchTerms] &&
      Date.now() - cache[searchTerms].timestamp < 50000
    ) {
      console.log('Movie Cache hit, found: ', Object.keys(cache[searchTerms]));
    } else {
      console.log('Movie Cache miss');
      cache[searchTerms] = {};
      cache[searchTerms].timestamp = Date.now();
      cache[searchTerms].data = await axios.get(url);
      console.log('Storing in cache: ', Object.keys(cache[searchTerms]));
    }

    let movieAPIData = cache[searchTerms].data;

    let movies = movieAPIData.data.results.map((result) => new Movie(result));

    response.send(movies);
  } catch (error) {
    errorResponse(error, request, response);
  }
}

class Movie {
  constructor(data) {
    this.title = data.title;
    this.overview = data.overview;
    this.vote_average = data.vote_average;
    this.vote_count = data.vote_count;
    this.image_url = data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : 'no-poster';
    this.popularity = data.popularity;
    this.release_date = data.release_date;
  }
}
module.exports = getMovies;
