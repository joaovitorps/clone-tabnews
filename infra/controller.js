import { InternalServerError, MethodNotAllowedError } from "./errors";

async function errorHandler(error, request, response) {
  console.log(error);
  const errorObj = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.log(errorObj);

  response.status(errorObj.statusCode).json(errorObj);
}

async function noMatchHandler(request, response) {
  const notAllowedObj = new MethodNotAllowedError({ method: request.method });

  response.status(notAllowedObj.statusCode).json(notAllowedObj);
}

const controller = {
  errorHandlers: {
    onError: errorHandler,
    onNoMatch: noMatchHandler,
  },
};

export default controller;
