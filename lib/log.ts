"use strict";

import * as logger from "pino";
import config from "./config";

export default logger({ level: config.get("log_level") });
