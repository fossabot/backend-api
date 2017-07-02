"use strict";

import * as Koa from "koa";
import config from "../lib/config";
import User from "../models/user";
import Session from "../models/session";
import { connection as db } from "../lib/db";
import log from "../lib/log";
import parse from "../lib/parseAuth";
import * as Errors from "../lib/errors";
import { Errors as SessionErrors } from "../models/session";

// TODO: recognize confirmation& service
export const authUser = async (ctx: Koa.Context) => {
  if (!ctx.headers.Authorization) {
    throw new Errors.AuthenticationNotFoundError();
  }
  const parsed = parse(ctx.headers.Authorization);
  ctx.state.authType = parsed.type;
  switch (parsed.type) {
    case "Basic": {
      const user = await db.getRepository(User).findOne({
        email: parsed.username,
      });
      if (!user) {
        throw new Errors.UserNotFoundError(parsed.username);
      } else {
        if (await user.checkPassword(parsed.password)) {
          ctx.state.user = user;
        } else {
          throw new Errors.PasswordMismatchError(user, parsed.password);
        }
      }
      break;
    }
    case "Bearer": {
      const session = await db.getRepository(Session).findOneById(parsed.token);
      if (!session) {
        throw new Errors.TokenInvalidError(parsed.token);
      } else {
        try {
          const user = await session.getUser();
          ctx.state.user = user;
        } catch (error) {
          if (error instanceof SessionErrors.UserNotFoundError) {
            throw new Errors.TokenInvalidError(parsed.token);
          } else if (error instanceof SessionErrors.TokenExpiredError) {
            throw new Errors.TokenExpiredError(session);
          } else {
            throw error;
          }
        }
      }
      break;
    }
  }
};