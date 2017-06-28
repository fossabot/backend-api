"use strict";

import { expect } from "chai";
import parse from "../../lib/parseAuth";
import { InvalidInputError, UnsupportedAuthTypeError } from "../../lib/parseAuth";

export default () => {
  describe("Basic auth", () => {
    it("works", () => {
      const result = parse("Basic dXNlcjpwYXNzd29yZA==");
      expect(result.type).eql("Basic");
      if (result.type === "Basic") {
        expect(result.username).eql("user");
        expect(result.password).eql("password");
      }
    });
    it("throws on not-base64 data", () => {
      expect(() => parse("Basic some*thing*not*base64"))
        .to.throw(InvalidInputError);
    });
    it("throws on invalid base64-decoded data", () => {
      expect(() => parse("Basic aW52YWxpZA=="))
        .to.throw(InvalidInputError);
    });
  });
  describe("Bearer auth", () => {
    it("works", () => {
      const result = parse("Bearer 8228ea23-6bae-499f-b780-69cc8903bfeb");
      expect(result.type).eql("Bearer");
      if (result.type === "Bearer") {
        expect(result.token).eql("8228ea23-6bae-499f-b780-69cc8903bfeb");
      }
    });
    it("throws on not-token data", () => {
      expect(() => parse("Bearer some*thing*not*bearer*token"))
        .to.throw(InvalidInputError);
    });
  });
  it("throws on unsupported type", () => {
    expect(() => parse("Invalid credentials"))
      .to.throw(UnsupportedAuthTypeError);
  });
  it("throws on corrupted header missing credentials", () => {
    expect(() => parse("Invalid"))
      .to.throw(InvalidInputError);
  });
  it("throws on corrupted header missing anything", () => {
    expect(() => parse("Authorization:"))
      .to.throw(InvalidInputError);
  });
};
