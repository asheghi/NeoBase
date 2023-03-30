import {createClient} from "@neobase/client";
import React, {useContext} from "react";

const getClient = () => {
  let baseUrl = location.protocol + "//" + location.host;
  return createClient(baseUrl);
};

export const client = getClient();
const clientContext = React.createContext<ReturnType<typeof getClient>>(client);
export const ClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <clientContext.Provider value={client}>
      {props.children}
    </clientContext.Provider>
  );
};

export const useClient = () => {
  return useContext(clientContext);
};
