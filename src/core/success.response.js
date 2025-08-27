const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
};
const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
  NO_CONTENT: "No Content",
};
class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res) {
    return res.status(this.status).json({
      status: this.status,
      message: this.message,
      metadata: this.metadata,
    });
  }
}
class OkResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}
class CreatedResponse extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
module.exports = {
  OkResponse,
  CreatedResponse,
};
