import http from "node:http";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly error: string;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;

    this.error = http.STATUS_CODES[statusCode] || "Error";
  }
}
