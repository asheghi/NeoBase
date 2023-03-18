import React from "react";
import DashboardLayout from "./components/DashboardLayout";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { IRouteItem, dashboardRoutes } from "./dashboard.routes";
import { Loading } from "./components/Loading";
import { manifest } from "../../lib/manifest.js";

export const Page = () => {
  const location = useLocation();
  const pageTitle =
    dashboardRoutes.find((it) => {
      return !it.hideNav && location.pathname.startsWith(it.path);
    })?.title ?? manifest.title;
  function renderRoutes(routes: IRouteItem[]) {
    return (
      <>
        {routes.map((item) => {
          return (
            <Route
              key={item.key}
              path={item.path + ""}
              element={
                <React.Suspense fallback={<Loading />}>
                  <item.page routeItem={item} />
                </React.Suspense>
              }
            >
              {item.nested && renderRoutes(item.nested)}
            </Route>
          );
        })}
      </>
    );
  }

  return (
    <DashboardLayout pageTitle={pageTitle}>
      <Routes>{renderRoutes(dashboardRoutes)}</Routes>
    </DashboardLayout>
  );
};
