import React from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "../../components/Loading";

export const AuthenticationPage = () => {
  return (
    <div>
      Auth page
      <br />
      <React.Suspense fallback={<Loading />}>
        <Outlet />
      </React.Suspense>
    </div>
  );
};
