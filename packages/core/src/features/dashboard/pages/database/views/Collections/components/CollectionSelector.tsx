import React, { useEffect, useState } from "react";
import { Box, ListItem, OutlinedInput, List } from "@mui/material";
import { useClient } from "../../../../../lib/client";

export const CollectionSelector = () => {
  const [search, setSearch] = useState();
  const client = useClient();
  const [collections, setCollections] = useState([]);

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
    <Box>
      <OutlinedInput
        placeholder={"search"}
        size={"small"}
        value={search}
        onChange={handleSearchInput}
      />
      <List>
        {collections.map((it) => (
          <ListItem>{it}</ListItem>
        ))}
      </List>
    </Box>
  );
};
