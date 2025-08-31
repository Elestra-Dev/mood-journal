import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../../app/client";
import { GET_MOODS, DELETE_MOOD } from "./queries";
import { Card, CardContent, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Mood = {
  id: string;
  day: string;   // ISO string
  emoji: string;
  note?: string | null;
};

type GetMoodsResponse = {
  moods: Mood[];
};

export function Timeline() {
  const qc = useQueryClient();

  const { data } = useQuery<Mood[]>({
    queryKey: ["moods"],
    queryFn: async () => {
      const res = await graphqlClient().request<GetMoodsResponse>(GET_MOODS);
      return res.moods;
    },
  });

  const del = useMutation<void, Error, string>({
    mutationFn: async (dayIso: string) => {
      await graphqlClient().request(DELETE_MOOD, { day: dayIso });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["moods"] });
    },
  });

  return (
    <Stack spacing={1} sx={{ mt: 2 }}>
      {data?.map((m) => (
        <Card key={m.id} variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography fontSize={24}>{m.emoji}</Typography>
              <Typography sx={{ minWidth: 140 }}>
                {new Date(m.day).toDateString()}
              </Typography>
              <Typography flex={1} color="text.secondary">
                {m.note || "—"}
              </Typography>
              <Tooltip title="Delete">
                <IconButton onClick={() => del.mutate(m.day)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
