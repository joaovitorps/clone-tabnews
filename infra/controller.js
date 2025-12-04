import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "./errors";

async function errorHandler(error, request, response) {
  if (error instanceof ValidationError) {
    return response.status(error.statusCode).json(error);
  }

  console.error(error);

  const errorObj = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(errorObj);

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
