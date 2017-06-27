"use strict";

process.env.NODE_ENV = "test";
import "../bin/run";
import models from "./models";
import api from "./api";

describe("models", models);
describe("api", api);
