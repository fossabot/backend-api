#!/usr/bin/env node

if (process.env.NODE_ENV !== "test") {
  console.log(`Sandra/backend-api (C) 2017 Sandra Project Team\n
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
under certain conditions.
For more information, see "${__dirname}/../LICENSE.md".
`);
}

import server from "../server";
import db from "../lib/db";
import config from "../lib/config";
import log from "../lib/log";

if (process.env.NODE_ENV === "test") {
  log.level = "silent";
}

const PORT = config.get("port") || 3000;

export default db
  .then((connection) => {
    log.info(`database connected to ${config.get("db_url")}`);
    server.listen(PORT);
    log.info(`server listening on port ${PORT}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
