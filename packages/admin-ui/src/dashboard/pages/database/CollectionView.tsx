import React from "react";
import { Link, Outlet, useLocation, useMatch, useMatches } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import { useCollection } from "./views/Collections/useCollection";



export const CollectionView = () => {
  const collection = useCollection();
  console.log('check: collection:',collection);
  
  const tabs = [
    {
      title: "Documents",
      href: `/dashboard/database/${collection}/documents/`,
    },
    {
      title: "Rules",
      href: `/dashboard/database/${collection}/rules/`,
    },
    {
      title: "Indexes",
      href: `/dashboard/database/${collection}/db-index/`,
    },
  ];
  const matches = tabs.map(it => useMatch(it.href + "*"));
  const selectedRouteIndex = matches.findIndex(it => it);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs aria-label="" value={selectedRouteIndex}>
          {(tabs ?? []).map((item, index) => {
            return (
              <Tab
                label={item.title}
                key={item.title + item.href}
                value={index}
                component={Link}
                to={item.href}
                disableRipple
                sx={{
                  minWidth: "0px",
                  paddingInline: 0,
                  p: 0,
                  mr: 2,
                  textAlign: "start",
                  textTransform: "capitalize",
                  fontFamily: "Poppins",
                }}
              ></Tab>
            );
          })}
        </Tabs>
      </Box>
      <Outlet />
    </>
  );
};

export default CollectionView;