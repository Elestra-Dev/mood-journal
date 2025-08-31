import { GraphQLScalarType, Kind } from "graphql";

export const DateScalar = new GraphQLScalarType({
  name: "Date",
  serialize(value: unknown) {
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value: unknown) {
    return new Date(value as string);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) return new Date(ast.value);
    return null;
  }
});
