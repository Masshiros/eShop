const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

const ReasonStatusCode = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  CONFLICT: "Conflict",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  BAD_GATEWAY: "Bad Gateway",
  SERVICE_UNAVAILABLE: "Service Unavailable",
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
class ConflictResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT,
  }) {
    super(message, statusCode);
  }
}
class BadRequestResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST,
  }) {
    super(message, statusCode);
  }
}
class UnauthorizedResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED,
  }) {
    super(message, statusCode);
  }
}

class ForbiddenResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN,
  }) {
    super(message, statusCode);
  }
}

class NotFoundResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND,
  }) {
    super(message, statusCode);
  }
}

class InternalServerErrorResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR,
  }) {
    super(message, statusCode);
  }
}

class BadGatewayResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.BAD_GATEWAY,
    statusCode = StatusCode.BAD_GATEWAY,
  }) {
    super(message, statusCode);
  }
}

class ServiceUnavailableResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.SERVICE_UNAVAILABLE,
    statusCode = StatusCode.SERVICE_UNAVAILABLE,
  }) {
    super(message, statusCode);
  }
}

class NoContentResponseError extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.NO_CONTENT,
    statusCode = StatusCode.NO_CONTENT,
  }) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictResponseError,
  BadRequestResponseError,
  UnauthorizedResponseError,
  ForbiddenResponseError,
  NotFoundResponseError,
  InternalServerErrorResponseError,
  BadGatewayResponseError,
  ServiceUnavailableResponseError,
  NoContentResponseError,
};
