const mongoose = require("mongoose");
const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../models/user");
const Post = require("../models/post");
const { MONGO_TEST_URL } = require("../env");
const feedController = require("../controllers/feed");
const socketHelper = require("../util/socket-helper");

describe("feed-controller: getStatus", () => {
  before(async () => {
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
  });

  it("should send a valid response with user status if user exists", async () => {
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
    expect(res.userStatus).to.be.equal("We can fix this!");
  });

  after(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    mongoose.disconnect();
  });
});

describe("feed-controller: createPost", () => {
  before(async () => {
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
  });

  it("should update creator post list with a new post", async () => {
    const req = {
      userId: "5c0f66b979af55031b34728a",
      file: {
        path: "myfile.lol",
      },
      body: {
        title: "Can we fix this?",
        content: "Yes we can!",
      },
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };
    const next = () => {};

    sinon.stub(socketHelper, "getIO");
    socketHelper.getIO.returns({emit: () => {}});

    const savedUser = await feedController.createPost(req, res, next);

    expect(savedUser).to.have.property("posts");
    expect(savedUser.posts).to.have.length(1);

    socketHelper.getIO.restore();
  });

  after(async () => {
    await Post.deleteMany({});
    await User.deleteMany({});
    mongoose.disconnect();
  });
});
