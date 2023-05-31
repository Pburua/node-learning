const mongoose = require("mongoose");
const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../models/user");
const { MONGO_TEST_URL } = require("../env");
const feedController = require("../controllers/feed");

describe("feed-controller: getStatus", () => {
  it("should send a valid response with user status if user exists", async () => {
    await mongoose.connect(MONGO_TEST_URL);

    const user = new User({
      _id: "5c0f66b979af55031b34728a",
      email: "bob@the.builder",
      password: "12345",
      name: "Bob",
      status: "We can fix this!",
      posts: [],
    });

    await user.save();

    const req = {
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    const next = () => {};

    await feedController.getStatus(req, res, next);

    expect(res.statusCode).to.be.equal(200);
    expect(res.userStatus).to.be.equal(user.status);

    await User.deleteMany({});

    mongoose.disconnect();
  });
});
