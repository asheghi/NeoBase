import React, { FormEvent, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { GoogleOAuthButton } from "../lib/components/GoogleOAuthButton";

interface ILoginPage {
  redirectUrl?: string;
}

export const RegisterPage = (props: ILoginPage) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const params = new URLSearchParams(window.location.search);

  const loginLink =
    "/login/" +
    (params.has("redirect") ? "?redirect=" + params.get("redirect") : "");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result: { success: boolean } = await fetch(
      "/api/user/auth/register/password",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        cache: "no-cache",
      }
    ).then((r) => r.json());

    if (!result.success) {
      return;
    }
    let redirectUrl =
      window.location.protocol + "//" + window.location.host + "/dashboard/";
    if (params.has("redirect")) {
      try {
        redirectUrl = atob(params.get("redirect") ?? "");
      } catch (e) {
        console.error(e);
      }
    }

    console.log("redirecting to", redirectUrl);
    window.location.href = redirectUrl;
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Grid container justifyContent={"center"}>
              <Grid item>
                <Link href={loginLink} variant="body2">
                  {"Already have an account? Sign in"}
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Box my={4} />
          <GoogleOAuthButton mode="Sign up" />
        </Box>
      </Container>
      );
    </>
  );
};
