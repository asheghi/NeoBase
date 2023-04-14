
import * as React from "react";
import DashboardLayout from "./components/DashboardLayout";
import { RouteObject, useLocation, useMatch } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCollection } from "./pages/database/views/Collections/useCollection";

const DatabasePage = React.lazy(() => import("./pages/database"));
const AuthenticationPage = React.lazy(() => import("./pages/authentication"));
const CollectionView = React.lazy(
  () => import("./pages/database/CollectionView")
);
const RulesView = React.lazy(() => import("./pages/database/views/Rules"));
const DocumentsView = React.lazy(
  () => import("./pages/database/views/Collections/Views/Documents")
);
const DocumentView = React.lazy(() =>
  import('./pages/database/views/Collections/Views/DocumentView')
)
const DbIndexView = React.lazy(
  () => import("./pages/database/views/DatabaseIndex")
);
const DashboardIndexPage = React.lazy(() => import("./pages/index"));

export const usePageTitle = () => {
  const [title, setPageTitle] = useState("");
  const location = useLocation();
  const collection = useCollection();

  const list = [
    {
      match: useMatch('/Dashboard/database'),
      title: 'Database',
    },
    {
      match: useMatch('/Dashboard/database/:collection/documents'),
      title: collection + ' documents',
    },
    {
      match: useMatch('/Dashboard/database/:collection/db-index'),
      title: collection + ' Indexes',
    }, {
      match: useMatch('/Dashboard/database/:collection/rules'),
      title: collection + ' Rules',
    },
    , {
      match: useMatch('/dashboard/data/collections/:collection/documents/'),
      title: useMatch('/dashboard/data/collections/:collection/documents/')?.params?.collection + ' Documents',
    },
    {
      match: useMatch('/Dashboard/Users'),
      title: 'Users'
    }
  ]

  useEffect(() => {
    const title = list.find(it => it?.match)?.title ?? location.pathname;
    setPageTitle(title);
    if (!title) {
      console.error('add page title case for', location.pathname)
    }
  }, [location.pathname])

  return title;
}
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardLayout />,

    children: [
      {
        path: "/dashboard",
        element: <React.Suspense>
          <DashboardIndexPage />
        </React.Suspense>,
      },
      // when no collection is selected
      {
        path: "/dashboard/database",
        element: <React.Suspense>
          <DatabasePage />
        </React.Suspense>
      },
      // if collection is selected
      {
        path: "/dashboard/database/:collection",
        element: <React.Suspense>
          <CollectionView />
        </React.Suspense>,
        // data
        // rules
        // index
        // usage
        // back-up - restore
        children: [
          {
            element: <React.Suspense>
              <DocumentsView />
            </React.Suspense>,
            path: "/dashboard/database/:collection/documents",
            children: [
              {
                element: <React.Suspense>
                  <DocumentView />
                </React.Suspense>,
                path: "/dashboard/database/:collection/documents/:documentId",
              },
            ],
          },
          {
            element: <React.Suspense>
              <RulesView />
            </React.Suspense>,
            path: "/dashboard/database/:collection/rules",
          },
          {
            element: <React.Suspense>
              <DbIndexView />
            </React.Suspense>,
            path: "/dashboard/database/:collection/db-index",
          },
        ],
      },
      {
        path: "/dashboard/users",
        element: <React.Suspense>
          <AuthenticationPage />
        </React.Suspense>,
      },
    ]
  },
];
