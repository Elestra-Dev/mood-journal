import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../../app/client";
import { GET_STATS } from "./queries";
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  Chart,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(ArcElement, ChartTooltip, Legend, BarElement, CategoryScale, LinearScale);

type CountsByEmoji = {
  emoji: string;
  count: number;
};

type Stats = {
  averageScore: number;
  countsByEmoji: CountsByEmoji[];
};

type GetStatsResponse = {
  stats: Stats;
};

export function StatsChart() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data } = useQuery<Stats>({
    queryKey: ["stats", month, year],
    queryFn: async () => {
      const res = await graphqlClient().request<GetStatsResponse>(GET_STATS, { month, year });
      return res.stats;
    },
  });

  const barData = useMemo(
    () => ({
      labels: data?.countsByEmoji.map((c) => c.emoji) ?? [],
      datasets: [
        {
          label: "Days",
          data: data?.countsByEmoji.map((c) => c.count) ?? [],
        },
      ],
    }),
    [data]
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">This month</Typography>
      <Typography variant="body2">
        Average score: {data?.averageScore?.toFixed(2) ?? "0.00"}
      </Typography>
      <Bar data={barData} />
    </Box>
  );
}
