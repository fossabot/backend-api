"use strict";

import User from "../models/user";

// tslint:disable:max-classes-per-file
export class ApiError extends Error {
  public readonly code: string = "UNDEFINED_ERROR";
  public readonly status: number = 500;
  constructor(code: string, httpCode: number) {
    super(code);
    this.name = code + "_Error";
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
  public readonly baseError: any;
  constructor(error: any) {
    super("INTERNAL_SERVER_ERROR", 500);
    this.baseError = error;
  }
}
export class BasicAuthNotSuppliedError extends ApiError {
  constructor() {
    super("BASIC_AUTH_NOT_SUPPLIED", 401);
  }
}
export class EmailNotFoundError extends ApiError {
  public readonly email: string;
  constructor(email: string) {
    super("EMAIL_NOT_FOUND", 401);
    this.email = email;
  }
}
export class PasswordMismatchError extends ApiError {
  public readonly user: User;
  public readonly wrongPassword: string;
  constructor(user: User, wrongPassword: string) {
    super("PASSWORD_MISMATCH", 401);
    this.user = user;
    this.wrongPassword = wrongPassword;
  }
}
export class InsufficientPermissionError extends ApiError {
  public readonly user: User;
  public readonly permission: string;
  constructor(user: User, permission: string) {
    super("INSUFFICIENT_PERMISSION", 403);
    this.user = user;
    this.permission = permission;
  }
}
