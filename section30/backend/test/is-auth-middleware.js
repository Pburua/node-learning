const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const isAuth = require("../middleware/is-auth");

describe("is-auth-middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get() {
        return null;
      },
    };
    const res = {};
    const next = () => {};
    expect(isAuth.bind(this, req, res, next)).to.throw("Not authenticated.");
  });

  it("should thow an error if authorization header is invalid", () => {
    const req = {
      get() {
        return "xyz";
      },
    };
    const res = {};
    const next = () => {};
    expect(isAuth.bind(this, req, res, next)).to.throw("Not authenticated.");
  });

  it("should thow an error if jwt token is invalid", () => {
    const req = {
      get() {
        return "Bearer xyz";
      },
    };
    const res = {};
    const next = () => {};
    expect(isAuth.bind(this, req, res, next)).to.throw("Not authenticated.");
  });

  it("should save a userId in a request if jwt token is valid ", () => {
    const req = {
      get() {
        return "Bearer xyz";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    const res = {};
    const next = () => {};
    isAuth(req, res, next);
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
