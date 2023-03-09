export const configureDashboardExpressApp = (app) => {
  // eslint-disable-next-line global-require
  const dashboard = require("@neobase/dashboard");
  console.log("fucking dashboard is:", dashboard);
  app.use(dashboard.middleware());
};
