import React from "react";
import { usePageContext } from "../../../../renderer/usePageContext";

export const Page = () => {
  const pageContext: any = usePageContext();
  return (
    <>
      <h1>Dashboard page!</h1>
      user: <pre>{JSON.stringify(pageContext.user)}</pre>
    </>
  );
};
