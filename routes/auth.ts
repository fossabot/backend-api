"use strict";

import * as Koa from "koa";
import config from "../lib/config";
import User from "../models/user";
import { connection as db } from "../lib/db";
import log from "../lib/log";

// tslint:disable:no-namespace
export namespace Errors {
  export class UserNotFound extends Error {
    public readonly email: string;
    constructor(email: string) {
      super(`user owning email ${email} does not exist`);
      this.name = "UserNotFoundError";
      this.email = email;
    }
  }
}
export const BasicAuth: Koa.Middleware = async (ctx, next) => {
};
