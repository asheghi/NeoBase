
import * as React from "react";
import DashboardLayout from "./components/DashboardLayout";
import {RouteObject, useLocation, useMatch} from "react-router-dom";
import {useEffect, useState} from "react";
const DatabasePage = React.lazy(() => import("./pages/database"));
const AuthenticationPage = React.lazy(() => import("./pages/authentication"));
const CollectionsView = React.lazy(
  () => import("./pages/database/views/Collections")
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
  const [title,setPageTitle] = useState("");
  const location = useLocation();

  const list = [
    {
      match:useMatch('/Dashboard/data/Collections'),
      title:'Collections',
    },
    {
      match:useMatch('/Dashboard/data/rules'),
      title:'Rules',
    },
    {
      match:useMatch('/Dashboard/data/db-index'),
      title:'Indexes',
    },{
      match:useMatch('/Dashboard/data/rules'),
      title:'Rules',
    },
    ,{
      match:useMatch('/dashboard/data/collections/:collection/documents/'),
      title: useMatch('/dashboard/data/collections/:collection/documents/')?.params?.collection + ' Documents',
    },
    {
      match: useMatch('/Dashboard/Users'),
      title:'Users'
    }
  ]

  useEffect(() => {
    const title = list.find(it => it?.match)?.title ?? location.pathname;
    setPageTitle(title);
    if(!title){
      console.error('add page title case for',location.pathname)
    }
  },[location.pathname])

  return title;
}
export const routes : RouteObject[]  = [
  {
    path:'/',
    element: <DashboardLayout  />,

    children:[
      {
        path: "/dashboard/",
        element: <React.Suspense>
          <DashboardIndexPage />
        </React.Suspense>,
      },
      {
        path: "/dashboard/data",
        element: <React.Suspense>
          <DatabasePage />
        </React.Suspense>,
        // data
        // rules
        // index
        // usage
        // back-up - restore
        children: [
          {
            element: <React.Suspense>
              <CollectionsView />
            </React.Suspense>,
            path: "/dashboard/data/collections/",
            children: [
              {
                element: <React.Suspense>
                  <DocumentsView />
                </React.Suspense>,
                path: "/dashboard/data/collections/:collection/documents/",
                children:[
                  {
                    element: <React.Suspense>
                      <DocumentView />
                    </React.Suspense>,
                    path: "/dashboard/data/collections/:collection/documents/:documentId",
                  }
                ]
              },
            ],
          },
          {
            element: <React.Suspense>
              <RulesView />
            </React.Suspense>,
            path: "/dashboard/data/rules/",
          },
          {
            element: <React.Suspense>
              <DbIndexView />
            </React.Suspense>,
            path: "/dashboard/data/db-index/",
          },
        ],
      },
      {
        path: "/dashboard/users",
        element: <React.Suspense>
          <AuthenticationPage />
        </React.Suspense>,
      },
    ]},
];
