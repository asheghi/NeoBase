import {Grid, List, ListItem, ListItemButton} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {useClient} from "../../../../../../../lib/client";
import {useDocuments} from "./useDocuments";

export const DocumentsView = () => {
  const params = useParams();
  const collection = params.collection;
  const documents = useDocuments(collection);
  if(!collection) return null;

  return <Grid container>
    <Grid item>
      <List>
        {documents.map(it => (<ListItem>
          <ListItemButton
            component={Link}
            to={`/dashboard/data/collections/${collection}/documents/${it._id}`}
          >
            {it?._id}
          </ListItemButton>
        </ListItem>))}
      </List>
    </Grid>
    <Grid item>
      <Outlet />
    </Grid>
  </Grid>;
};
