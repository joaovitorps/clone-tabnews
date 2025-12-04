export class InternalServerError extends Error {
  constructor({ statusCode, cause }) {
    super("Erro inesperado aconteceu.", {
      cause,
    });

    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte.";
    this.statusCode = statusCode || 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor({ method }) {
    super(`Método ${method} não permitido para este endpoint.`);

    this.name = "MethodNotAllowedError";
    this.action = "Envie um método HTTP válido.";
    this.statusCode = 405;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ message, cause }) {
    super(message || "Falha de serviço.", {
      cause,
    });

    this.name = "ServiceError";
    this.action = "Verifique se o serviço está rodando.";
    this.statusCode = 503;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ValidationError extends Error {
  constructor({ cause, message, action }) {
    super(message || "Falha de validação.", {
      cause,
    });

    this.name = "ValidationError";
    this.action = action || "Verifique os dados enviados e tente novamente.";
    this.statusCode = 400;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
