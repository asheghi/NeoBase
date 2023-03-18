import React from "react";
import { Navigate } from "react-router-dom";

export const DashboardIndexPage = () => {
  // return <div>index page!</div>;
  return <Navigate to={"/data"} replace />;
};
