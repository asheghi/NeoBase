import { Button, Box } from "@mui/material";

export const GoogleOAuthButton = (props: { mode: "Sign in" | "Sign up" }) => {
  const loginWithGoogleLink = "/api/user/auth/google";
  return (
    <Button
      variant="outlined"
      href={loginWithGoogleLink}
      sx={{ height: "38px" }}
    >
      <Box display="flex" gap={2} alignItems="center">
        <img width="18" height="18" src="/google-logo.svg" />
        <div>{props.mode} with Google</div>
      </Box>
    </Button>
  );
};
