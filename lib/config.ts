"use strict";

import * as Config from "config-file-bi";
import * as fs from "fs-extra";

let config: Config;

let path = process.env.CLOVER_CONFIG;
if (process.env.NODE_ENV !== "test") {

  if (fs.pathExistsSync("./config/config.yaml")) {
    path = path || "./config/config.yaml";
  }
  path = path || "./config/config.sample.yaml";
} else {
  path = "./config/config.test.yaml";
}
config = new Config(path);
config.pullSync();

export default config;
