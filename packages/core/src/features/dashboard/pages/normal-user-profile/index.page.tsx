import React from "react";
import { usePageContext } from "../../../../renderer/usePageContext";

export const Page = () => {
  const context = usePageContext();
  return (
    <>
      <h1>Profile:</h1>
      username:
      <div>{context.user?.username}</div>
    </>
  );
};
