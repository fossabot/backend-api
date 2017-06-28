"use strict";

import * as Config from "config-file-bi";
import * as fs from "fs-extra";

let config: Config;

// TODO: add unit test
export const getConfigPath = () => {
  let path = process.env.SANDRA_BACKEND_CONFIG;
  if (fs.pathExistsSync("./config/config.yaml")) {
    path = path || "./config/config.yaml";
  }
  path = path || "./config/config.sample.yaml";
  return path;
};

config = new Config(getConfigPath());
config.pullSync();

export default config;
