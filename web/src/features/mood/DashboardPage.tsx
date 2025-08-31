import { Container, Paper, Stack, Typography, Button } from "@mui/material";
import { MoodForm } from "./MoodForm";
import { Timeline } from "./Timeline";
import { StatsChart } from "./StatsChart";
import { auth } from "../../app/auth";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const nav = useNavigate();
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Mood Journal</Typography>
          <Button onClick={()=>{ auth.clear(); nav("/login"); }} variant="text">Logout</Button>
        </Stack>
        <MoodForm />
        <Timeline />
        <StatsChart />
      </Paper>
    </Container>
  );
}
