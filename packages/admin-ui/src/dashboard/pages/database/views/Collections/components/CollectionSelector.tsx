import React, { useEffect, useState } from "react";
import {Box, ListItem, OutlinedInput, List, ListItemButton, ListItemText} from "@mui/material";
import { useClient } from "../../../../../../lib/client";
import {Link} from "react-router-dom";

export const CollectionSelector = () => {
  const [search, setSearch] = useState();
  const client = useClient();
  const [collections, setCollections] = useState<{name:string}[]>([]);

  useEffect(function () {
    client.Admin.Collection.getListOfCollections().then(({ data }) => {
      setCollections(data);
    });
    return () => {
      //
    };
  }, []);
  const handleSearchInput = (e: any) => {
    setSearch(e.target.value);
  };

  return (
    <Box sx={{pr:2}}>
      <OutlinedInput
        placeholder={"search"}
        size={"small"}
        value={search}
        onChange={handleSearchInput}
        sx={{
            width:'100%'
        }}
      />
      <List>
        {collections.map((it) => (
          <ListItem sx={{px:0}}
                    key={it.name}
                    component={Link}
                    to={`/dashboard/database/${it.name}/documents`}
          >
              <ListItemButton>
                  <ListItemText sx={{color:'primary.main'}}>
                      {it.name}
                  </ListItemText>
              </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
