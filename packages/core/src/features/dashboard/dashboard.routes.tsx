import DatabaseIcon from "@mui/icons-material/Storage";
import UsersIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import IndexDbIcon from "@mui/icons-material/LowPriority";
import * as React from "react";
const DatabasePage = React.lazy(() => import("./pages/database"));
const AuthenticationPage = React.lazy(() => import("./pages/authentication"));
const DataView = React.lazy(() => import("./pages/database/views/Data"));
const RulesView = React.lazy(() => import("./pages/database/views/Rules"));
const DbIndexView = React.lazy(
  () => import("./pages/database/views/DatabaseIndex")
);
const DashboardIndexPage = React.lazy(() => import("./pages/index"));

export interface IRouteItem {
  key: string;
  title: string;
  icon?: any;
  path: string;
  page: any;
  nested?: IRouteItem[];
  index?: boolean;
  hideNav?: boolean;
}
export const dasbhoardRoutes: IRouteItem[] = [
  {
    hideNav: true,
    index: true,
    key: "index",
    title: "Dashboard",
    icon: DashboardIcon,
    path: "/",
    page: DashboardIndexPage,
  },
  {
    key: "database",
    title: "Database",
    icon: DatabaseIcon,
    path: "/data",
    page: DatabasePage,
    // data
    // rules
    // index
    // usage
    // back-up - restore
    nested: [
      {
        key: "data-view",
        page: DataView,
        path: "/data/",
        title: "data",
        icon: DatabaseIcon,
      },
      {
        key: "rules-view",
        page: RulesView,
        path: "/data/rules/",
        title: "rules",
        icon: DatabaseIcon,
      },
      {
        key: "index",
        page: DbIndexView,
        path: "/data/db-index/",
        title: "Index",
        icon: IndexDbIcon,
      },
    ],
  },
  {
    key: "auth",
    title: "Authentication",
    icon: UsersIcon,
    path: "/users",
    page: AuthenticationPage,
  },
];
