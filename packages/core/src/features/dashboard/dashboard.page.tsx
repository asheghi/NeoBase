import React from "react";
import app from "../../../../admin-ui/src/dashboard/App";
export const Page = app;

/*
export const Page = () => {
  const location = useLocation();
  const pageTitle =
    dashboardRoutes.find((it) => {
      return !it.hideNav && location.pathname.startsWith(it.path);
    })?.title ?? manifest.title;
  function renderRoutes(routes: IRouteItem[]) {
    return (
      <ClientProvider>
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
      </ClientProvider>
    );
  }

  return (
    <DashboardLayout pageTitle={pageTitle}>
      <Routes>{renderRoutes(dashboardRoutes)}</Routes>
    </DashboardLayout>
  );
};
*/
