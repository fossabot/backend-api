"use strict";

import Router = require("koa-router");
const router = new Router();
import config from "../lib/config";
import User from "../models/user";
import { connection } from "../lib/db";
import log from "../lib/log";
import * as Errors from "../lib/errors";

interface ICtxState {
  authType: "Basic" | "Bearer";
  user?: User;
  // TODO: support confirmation& service
}

export default router;
