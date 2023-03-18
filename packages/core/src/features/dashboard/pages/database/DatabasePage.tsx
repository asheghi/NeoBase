import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Box, Tab, Tabs } from "@mui/material";
import { IRouteItem } from "../../dashboard.routes";

export const DatabasePage = (props: { routeItem: IRouteItem }) => {
  const routes = props?.routeItem?.nested ?? [];
  const location = useLocation();

  const selectedRouteIndex = routes.findIndex((it) =>
    it.path.startsWith(location.pathname)
  );

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs aria-label="" value={selectedRouteIndex}>
          {(routes ?? []).map((item, index) => {
            return (
              <Tab
                label={item.title}
                key={item.key}
                value={index}
                component={Link}
                to={item.path}
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
    </div>
  );
};
