import { createClient } from "@neobase/client";
import React, { useContext } from "react";

const getClient = () => {
  if (import.meta.env.SSR) {
    return {};
  }
  return createClient(location.protocol + "://" + location.hostname);
};

const client = getClient();
const clientContext = React.createContext<ReturnType<typeof getClient>>(client);
export const ClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <clientContext.Provider value={client}>
      {props.children}
    </clientContext.Provider>
  );
};

export const useClient = () => {
  const client = useContext(clientContext);
  return client;
};
