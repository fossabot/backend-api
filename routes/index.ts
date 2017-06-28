"use strict";

import Router = require("koa-router");
const router = new Router();
import config from "../lib/config";
import User from "../models/user";
import { connection } from "../lib/db";
import log from "../lib/log";
import * as Errors from "../lib/errors";

declare module "koa" {
  // tslint:disable-next-line
  interface Context {
    user: User | undefined;
  }
}

router.get("/", async (ctx) => {
  throw new Errors.NotImplementedError();
});

export default router;
