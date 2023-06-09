const { buildSchema } = require("graphql");

const graphqlSchema = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    posts: [Post!]!
  }

  type PostsData {
    posts: [Post!]!
    totalPosts: Int!
  }

  type PostData {
    post: Post!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  input UserInputData {
    email: String!
    name: String!
    password: String!
  }

  input PostInputData {
    title: String!
    content: String!
    imageUrl: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostInputData): Post!
    updatePost(id: ID!, postInput: PostInputData): Post!
    deletePost(id: ID!): Boolean!
    updateStatus(status: String!): String!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    getPosts(page: Int!): PostsData!
    getPost(postId: String!): PostData!
    getStatus: String!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

module.exports = graphqlSchema;
