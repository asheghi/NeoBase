export const configureDashboardExpressApp = (app) => {
  // eslint-disable-next-line global-require
  const dashboard = require("@neobase/dashboard");
  app.use(dashboard.getDashboardMiddleware(app));
};
