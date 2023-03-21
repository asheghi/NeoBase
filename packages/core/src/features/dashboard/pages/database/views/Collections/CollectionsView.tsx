import React from "react";
import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import { CollectionSelector } from "./components/CollectionSelector";

export const CollectionsView = () => {
  return (
    <Grid container>
      <Grid xs={3} className="collection-selector">
        <CollectionSelector />
      </Grid>
      <Grid xs={9}>
        <Outlet />
      </Grid>
    </Grid>
  );
};
