const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../models/user");
const authController = require("../controllers/auth");

describe("auth-controller: login", () => {
  it("should throw an error if accessing to db fails", async () => {
    const req = {
      body: {
        email: "some@mail.com",
        password: "mypass",
      },
    };
    const res = {};
    const next = () => {};

    sinon.stub(User, "findOne");
    User.findOne.throws();

    const result = await authController.login(req, res, next);

    expect(result).to.be.an("error");

    User.findOne.restore();
  });
});
