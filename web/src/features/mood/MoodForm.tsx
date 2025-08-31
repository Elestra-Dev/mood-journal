import { Stack, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmojiPicker } from "./EmojiPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../../app/client";
import { UPSERT_MOOD } from "./queries";

const schema = z.object({
  day: z.coerce.date(),
  emoji: z.string().min(1),
  note: z.string().max(280).optional(),
});
type Form = z.infer<typeof schema>;

// Define what the server returns for upsert
type Mood = {
  id: string;
  day: string;
  emoji: string;
  note?: string | null;
};
type UpsertMoodResponse = { upsertMood: Mood };

export function MoodForm({ defaultDay = new Date() }: { defaultDay?: Date }) {
  const qc = useQueryClient();
  const { register, handleSubmit, watch, setValue } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { day: defaultDay, emoji: "🙂", note: "" },
  });

  const mutation = useMutation<Mood, Error, Form>({
    mutationFn: async (data: Form) => {
      const res = await graphqlClient().request<UpsertMoodResponse>(UPSERT_MOOD, { input: data });
      return res.upsertMood;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["moods"] }),
  });

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          type="date"
          label="Day"
          InputLabelProps={{ shrink: true }}
          {...register("day", { valueAsDate: true })}
        />
        <EmojiPicker value={watch("emoji")} onChange={(v) => setValue("emoji", v)} />
        <TextField label="Note" fullWidth {...register("note")} />
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          Save
        </Button>
      </Stack>
    </form>
  );
}
