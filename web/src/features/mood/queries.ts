export const UPSERT_MOOD = /* GraphQL */ `
  mutation UpsertMood($input: UpsertMoodInput!) {
    upsertMood(input: $input) { id emoji note day createdAt }
  }
`;
export const DELETE_MOOD = /* GraphQL */ `
  mutation DeleteMood($day: Date!) { deleteMood(day: $day) }
`;
export const GET_MOODS = /* GraphQL */ `
  query Moods($rangeStart: Date, $rangeEnd: Date) {
    moods(rangeStart: $rangeStart, rangeEnd: $rangeEnd) { id emoji note day }
  }
`;
export const GET_STATS = /* GraphQL */ `
  query Stats($month: Int!, $year: Int!) {
    stats(month: $month, year: $year) { total averageScore countsByEmoji { emoji count } }
  }
`;
