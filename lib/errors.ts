"use strict";

import User from "../models/user";
import Session from "../models/session";

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
export class InvalidRequestBodyError extends ApiError {
  constructor() {
    super("INVALID_REQUEST_BODY_TYPE", 400);
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
export class AuthenticationNotFoundError extends ApiError {
  constructor() {
    super("AUTHENTICATION_NOT_FOUND", 401);
    // TODO: auto respond WWW-Authenticate header
  }
}
export class UserNotFoundError extends ApiError {
  public readonly email: string;
  constructor(email: string) {
    super("USER_NOT_FOUND", 403);
    this.email = email;
  }
}
export class PasswordMismatchError extends ApiError {
  public readonly user: User;
  public readonly wrongPassword: string;
  constructor(user: User, wrongPassword: string) {
    super("PASSWORD_MISMATCH", 403);
    this.user = user;
    this.wrongPassword = wrongPassword;
  }
}
export class InvalidAuthenticationTypeError extends ApiError {
  public readonly wrong: string;
  public readonly right: string;
  constructor(wrong: string, right: string) {
    super("INVALID_AUTHENTICATION_TYPE", 401);
    // TODO: auto respond WWW-Authenticate header
    this.wrong = wrong;
    this.right = right;
  }
}
export class TokenExpiredError extends ApiError {
  public readonly session: Session;
  constructor(session: Session) {
    super("EXPIRED_TOKEN", 403);
    this.session = session;
  }
}
export class TokenInvalidError extends ApiError {
  public readonly token: string;
  constructor(token: string) {
    super("INVALID_TOKEN", 403);
    this.token = token;
  }
}
export class InsufficientPermissionError extends ApiError {
  public readonly session: Session;
  public readonly permission: string;
  constructor(session: Session, permission: string) {
    super("INSUFFICIENT_PERMISSION", 403);
    this.session = session;
    this.permission = permission;
  }
}
