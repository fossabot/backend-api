"use strict";

import { expect } from "chai";
import * as request from "request-promise-native";
import { connection as db } from "../../lib/db";
import User from "../../models/user";
import Session from "../../models/session";
import * as Errors from "../../lib/errors";
import ms = require("ms");

const baseUrl = "http://127.0.0.1:3000";
const dateRegExp = /^\d{4,4}-\d{2,2}-\d{2,2}T\d{2,2}:\d{2,2}:\d{2,2}.\d{3,3}Z$/;

// tslint:disable:no-unused-expression
export default () => {
  describe("PUT /session", () => {
    const user = new User("user@example.com");
    before(async () => {
      await db.getRepository(User).clear();
      await user.setPassword("123456");
      await db.getRepository(User).persist(user);
    });
    after(async () => {
      await db.getRepository(User).clear();
    });
    beforeEach(async () => {
      await db.getRepository(Session).clear();
    });
    after(async () => {
      await db.getRepository(Session).clear();
    });
    it("return 200 for correct request", async () => {
      const result = await request({
        method: "PUT",
        url: `${baseUrl}/session`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
        auth: {
          username: "user@example.com",
          password: "123456",
        },
      });
      expect(result.statusCode).eql(200);
      expect(result.body.token).to.be.a("string");
      {
        const us = result.body.user;
        const uv = user.toView();
        const handleDate = (str: string) => str.substr(0, str.length - 5);
        expect(us.id).to.eql(uv.id);
        expect(us.email).to.eql(uv.email);
        expect(us.permissions).to.eql(uv.permissions);
        expect(handleDate(us.createdAt)).to.eql(handleDate(uv.createdAt));
        expect(handleDate(us.updatedAt)).to.eql(handleDate(uv.updatedAt));
      }
      expect(result.body.permissions.admin).to.be.false;
      expect(result.body.createdAt).to.match(dateRegExp);
      expect(result.body.updatedAt).to.match(dateRegExp);
      expect(result.body.expiresAt).to.match(dateRegExp);
    });
    it("return 401 for unauthorized request", async () => {
      const result = await request({
        method: "PUT",
        url: `${baseUrl}/session`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
      });
      expect(result.statusCode).eql(401);
      expect(result.body.code).eql("AUTHENTICATION_NOT_FOUND");
      expect(result.headers["www-authenticate"]).eql("Basic");
    });
    it("return 401 for unauthorized request", async () => {
      const result = await request({
        method: "PUT",
        url: `${baseUrl}/session`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
        auth: {
          bearer: "SOME_TOKEN",
        },
      });
      expect(result.statusCode).eql(401);
      expect(result.body.code).eql("INVALID_AUTHENTICATION_TYPE");
      expect(result.headers["www-authenticate"]).eql("Basic");
    });
    it("return 403 for unfound email", async () => {
      const result = await request({
        method: "PUT",
        url: `${baseUrl}/session`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
        auth: {
          username: "null@example.com",
          password: "123456",
        },
      });
      expect(result.statusCode).eql(403);
      expect(result.body.code).eql("USER_NOT_FOUND");
    });
    it("return 403 for wrong password", async () => {
      const result = await request({
        method: "PUT",
        url: `${baseUrl}/session`,
        simple: false,
        resolveWithFullResponse: true,
        json: true,
        auth: {
          username: "user@example.com",
          password: "invalid",
        },
      });
      expect(result.statusCode).eql(403);
      expect(result.body.code).eql("PASSWORD_MISMATCH");
    });
    describe("without admin permissions", () => {
      before(async () => {
        user.permissions.admin = false;
        await db.getRepository(User).persist(user);
      });
      it("throws 403 on insufficient permissions", async () => {
        const result = await request({
          method: "PUT",
          url: `${baseUrl}/session`,
          simple: false,
          resolveWithFullResponse: true,
          json: true,
          auth: {
            username: "user@example.com",
            password: "123456",
          },
          body: {
            permissions: {
              admin: true,
            },
          },
        });
        expect(result.statusCode).eql(403);
        expect(result.body.code).eql("INSUFFICIENT_PERMISSION");
      });
    });
    describe("with admin permission", () => {
      before(async () => {
        user.permissions.admin = true;
        await db.getRepository(User).persist(user);
      });
      it("defaults to false", async () => {
        const result = await request({
          method: "PUT",
          url: `${baseUrl}/session`,
          simple: false,
          resolveWithFullResponse: true,
          json: true,
          auth: {
            username: "user@example.com",
            password: "123456",
          },
        });
        expect(result.statusCode).eql(200);
        expect(result.body.permissions.admin).to.be.false;
      });
      it("handles permission parameter correctly", async () => {
        const result = await request({
          method: "PUT",
          url: `${baseUrl}/session`,
          simple: false,
          resolveWithFullResponse: true,
          json: true,
          auth: {
            username: "user@example.com",
            password: "123456",
          },
          body: {
            permissions: {
              admin: false,
            },
          },
        });
        expect(result.statusCode).eql(200);
        expect(result.body.permissions.admin).to.be.false;
      });
      it("handles permission parameter correctly", async () => {
        const result = await request({
          method: "PUT",
          url: `${baseUrl}/session`,
          simple: false,
          resolveWithFullResponse: true,
          json: true,
          auth: {
            username: "user@example.com",
            password: "123456",
          },
          body: {
            permissions: {
              admin: true,
            },
          },
        });
        expect(result.statusCode).eql(200);
        expect(result.body.permissions.admin).to.be.true;
      });
    });
  });
};
