"use strict";

process.env.NODE_ENV = "test";
import run from "../bin/run";
import models from "./models";
import api from "./api";

before(async () => await run);
describe("models", models);
describe("api", api);
