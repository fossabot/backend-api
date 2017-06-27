"use strict";

// tslint:disable:max-classes-per-file
export class ApiError extends Error {
  public code = "UNDEFINED_ERROR";
  public status = 500;
  constructor(code: string, httpCode: number) {
    super(code);
    this.code = code;
    this.status = httpCode;
  }
}
export class NotFoundError extends ApiError {
  constructor() {
    super("API_ENDPOINT_NOT_FOUND", 404);
  }
}
export class NotImplementedError extends ApiError {
  constructor() {
    super("NOT_IMPLEMENTED", 501);
  }
}
export class InternalServerError extends ApiError {
  public baseError: any;
  constructor(error: any) {
    super("INTERNAL_SERVER_ERROR", 500);
    this.baseError = error;
  }
}
