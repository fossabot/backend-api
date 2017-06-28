"use strict";

// tslint:disable:max-classes-per-file
export class InvalidInputError extends Error {
  constructor() {
    super("invalid input for auth parse");
    this.name = "InvalidInputError";
  }
}
export class UnsupportedAuthTypeError extends Error {
  constructor(type: string) {
    super(`unsupported auth type ${type}`);
    this.name = "UnsupportedAuthTypeError";
  }
}

export const AuthRegExp = /^([\S]{0,}) ([\S]{0,})$/;
export const BasicRegExp = /^[A-Za-z0-9\+\/\-_]*={0,2}$/;
export const BasicDecodedRegExp = /^([^\s:]+):([^\s:]+)$/;
export const BearerTokenRegExp = /^[A-Za-z0-9\-\._~\+\/]+=*$/;

const parseBasic = (credentials: string) => {
  if (!BasicRegExp.test(credentials)) {
    throw new InvalidInputError();
  }
  const decoded = new Buffer(credentials, "base64").toString();
  const result = BasicDecodedRegExp.exec(decoded);
  if (!result) {
    throw new InvalidInputError();
  } else {
    return {
      username: result[1],
      password: result[2],
    };
  }
};
const parseBearer = (credentials: string) => {
  if (!BearerTokenRegExp.test(credentials)) {
    throw new InvalidInputError();
  }
  return credentials;
};

interface IBasicResult {
  type: "Basic";
  username: string;
  password: string;
}
interface IBearerResult {
  type: "Bearer";
  token: string;
}

const parse: (authorize: string) => IBasicResult | IBearerResult = (authorize: string) => {
  const result = AuthRegExp.exec(authorize);
  if (!result) {
    throw new InvalidInputError();
  } else {
    switch (result[1]) {
      case "Basic": {
        return { ...parseBasic(result[2]), type: "Basic" };
      }
      case "Bearer": {
        return { token: parseBearer(result[2]), type: "Bearer" };
      }
      default: {
        throw new UnsupportedAuthTypeError(result[1]);
      }
    }
  }
};
export default parse;
