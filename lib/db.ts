"use strict";

import { createConnection, Connection } from "typeorm";
import config from "../lib/config";

export let connection: Connection;
export default createConnection({
  type: "mysql",
  url: config.get("mysql_url"),
  entities: [
    __dirname + "/../models/*.js",
  ],
  autoSchemaSync: true,
}).then((conn) => {
  connection = conn;
});
