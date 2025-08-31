import { 
  Container, 
  Paper, 
  Stack, 
  Typography, 
  TextField, 
  Button,
  Box,
  Divider,
  InputAdornment,
  IconButton,
  Alert
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { graphqlClient } from "../../app/client";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../../app/auth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { 
  Visibility, 
  VisibilityOff, 
  EmailRounded,
  LockRounded,
  PersonRounded
} from "@mui/icons-material";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type Form = z.infer<typeof schema>;

const REGISTER = /* GraphQL */ `
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user { id email }
    }
  }
`;

type RegisterResponse = {
  register: { token: string; user: { id: string; email: string } };
};

export function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  });
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation<RegisterResponse["register"], Error, Form>({
    mutationFn: async (data: Form) => {
      const res = await graphqlClient().request<RegisterResponse>(REGISTER, data);
      return res.register;
    },
    onSuccess: ({ token }) => {
      auth.set(token);
      nav("/app");
    },
    onError: (error: Error) => {
      setErrorMessage(error.message || "Registration failed. Please try again.");
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      py: 4 
    }}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="700" 
            color="primary"
            gutterBottom
          >
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up to get started with our service
          </Typography>
        </Box>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: (theme) => theme.palette.mode === 'light' 
              ? '#fff' 
              : theme.palette.background.paper,
            boxShadow: (theme) => theme.shadows[5]
          }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          <Stack 
            component="form" 
            spacing={3} 
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
          >
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailRounded color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockRounded color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />

            <Button
              type="submit"
              disabled={mutation.isPending}
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                mt: 2
              }}
            >
              {mutation.isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Or
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    textDecoration: 'none', 
                    fontWeight: 600,
                    color: 'inherit'
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}