export const userTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    createdAt: Date!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
  }
`;
