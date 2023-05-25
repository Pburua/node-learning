const graphqlResolver = {
  hello() {
    return {
      text: "Hello World!",
      views: 12345,
    };
  },
};

module.exports = graphqlResolver;
