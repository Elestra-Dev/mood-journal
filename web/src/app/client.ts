import { GraphQLClient } from "graphql-request";

export const graphqlClient = () =>
  new GraphQLClient(import.meta.env.VITE_API_URL ?? "http://localhost:4000/graphql", {
    headers: () => {
      const token = localStorage.getItem("token");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  } as any);
