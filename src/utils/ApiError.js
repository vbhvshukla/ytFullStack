class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    statck = ""
  ) {
    super(message); //override message
    this.statusCode = statusCode; //override error's status code with our parameter statusCode
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (statck) {
      this.stack = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
