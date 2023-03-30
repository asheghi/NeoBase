import React from "react";
import { Grid } from "@mui/material";
import {Outlet, useParams} from "react-router-dom";
import { CollectionSelector } from "./components/CollectionSelector";

export const CollectionsView = () => {
    const {collection,documentId} = useParams<{collection: string; documentId: string}>();

    return (
    <Grid container>
      <Grid xs={12} md={3} className="collection-selector" item>
        <CollectionSelector />
      </Grid>
      <Grid xs={12} md={9} item>
        <Outlet />
      </Grid>
    </Grid>
  );
};
