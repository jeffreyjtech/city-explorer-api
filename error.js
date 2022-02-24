'use strict';

function errorResponse(error, request, response) {
  error.status = error.status || 400;
  error.message = `Error on request with route ${request.route.path || 'unknown'}: ${error.message}`;
  response.status(error.status).send(`${error.message}`);
}

module.exports = errorResponse;
