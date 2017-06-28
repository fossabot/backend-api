"use strict";

process.env.NODE_ENV = "test";
import run from "../bin/run";
import models from "./models";
import api from "./api";
import lib from "./lib";

before(async () => await run);
describe("lib", lib);
describe("models", models);
describe("api", api);
