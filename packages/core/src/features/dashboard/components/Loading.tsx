import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import React from "react";

export const Loading = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};
