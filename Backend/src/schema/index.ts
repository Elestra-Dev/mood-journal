import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateScalar } from "./scalars";
import { userTypeDefs } from "../modules/user/user.typeDefs";
import { userResolvers } from "../modules/user/user.resolvers";
import { moodTypeDefs } from "../modules/mood/mood.typeDefs";
import { moodResolvers } from "../modules/mood/mood.resolvers";

const base = /* GraphQL */ `
  scalar Date
  type Query { _empty: String }
  type Mutation { _empty: String }
`;

export const schema = makeExecutableSchema({
  typeDefs: [base, userTypeDefs, moodTypeDefs],
  resolvers: [{ Date: DateScalar }, userResolvers, moodResolvers]
});
