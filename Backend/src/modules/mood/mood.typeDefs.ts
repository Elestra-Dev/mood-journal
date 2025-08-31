export const moodTypeDefs = /* GraphQL */ `
  scalar Date

  type Mood {
    id: ID!
    emoji: String!
    note: String
    day: Date!
    createdAt: Date!
  }

  type EmojiCount {
    emoji: String!
    count: Int!
  }

  type MoodStats {
    total: Int!
    countsByEmoji: [EmojiCount!]!
    averageScore: Float!
  }

  input UpsertMoodInput {
    day: Date!
    emoji: String!
    note: String
  }

  extend type Query {
    moods(rangeStart: Date, rangeEnd: Date): [Mood!]!
    stats(month: Int!, year: Int!): MoodStats!
  }

  extend type Mutation {
    upsertMood(input: UpsertMoodInput!): Mood!
    deleteMood(day: Date!): Boolean!
  }
`;
