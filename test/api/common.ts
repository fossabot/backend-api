"use strict";

import User from "../../models/user";
import { expect } from "chai";
import config from "../../lib/config";
import * as request from "request-promise-native";

const baseUrl = "http://127.0.0.1:3000";

export default () => {
  describe("on undefined api endpoints, should throw API_ENDPOINT_NOT_FOUND", () => {
    it("undefined api path", async () => {
      const result = await request({
        url: `${baseUrl}/null`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
      });
      expect(result.statusCode).to.eql(404);
      expect(result.body).to.eql({ code: "API_ENDPOINT_NOT_FOUND" });
    });
    it("defined api path with different method", async () => {
      const result = await request({
        method: "POST",
        url: `${baseUrl}/`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
      });
      expect(result.statusCode).to.eql(404);
      expect(result.body).to.eql({ code: "API_ENDPOINT_NOT_FOUND" });
    });
    it("defined api path with unimplemented method", async () => {
      const result = await request({
        method: "SEARCH",
        url: `${baseUrl}/`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
      });
      expect(result.statusCode).to.eql(501);
      expect(result.body).to.eql({ code: "NOT_IMPLEMENTED" });
    });
  });
};
