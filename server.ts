"use strict";

import "./lib/db";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import "reflect-metadata";
import * as mount from "koa-mount";
import * as koaJson from "koa-json";
import config from "./lib/config";
import router from "./routes";
import log from "./lib/log";
import * as Errors from "./lib/errors";

const app = new Koa();

app.use(koaJson({
  pretty: false,
}));
app.use(async (ctx, next) => {
  try {
    await next();
    if (!ctx.body) {
      throw new Errors.NotFoundError();
    }
  } catch (error) {
    if (!(error instanceof Errors.ApiError)) {
      error = new Errors.InternalServerError(error);
    }
    log.error(error, "an error occured",
      JSON.stringify(error.baseError, ["message", "arguments", "type", "name", "stack"]));
    ctx.status = error.status;
    ctx.body = {
      code: error.code,
    };
  }
});
// TODO: logger
app.use(bodyParser());
app
  .use(router.routes())
  .use(router.allowedMethods({
    throw: true,
    notImplemented: () => new Errors.NotImplementedError(),
    methodNotAllowed: () => new Errors.NotFoundError(),
  }));

export default app;
