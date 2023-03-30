import React from "react";
import {Link, Outlet, useLocation, useMatch, useMatches} from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";

const tabs = [
    {
        title:"Collections",
        href:"/dashboard/data/collections/",
    },
    {
        title:"Rules",
        href:"/dashboard/data/rules/",
    },
    {
        title:"Indexes",
        href:"/dashboard/data/db-index/",
    },
];

export const DatabasePage = () => {
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
