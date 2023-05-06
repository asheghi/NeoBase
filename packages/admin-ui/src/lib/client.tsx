import React, { useContext } from "react";
import { Api } from './api';

const clientContext = React.createContext<typeof Api>(Api);

export const ClientProvider = (props: { children: React.ReactNode }) => {
  return (
    <clientContext.Provider value={Api}>
      {props.children}
    </clientContext.Provider>
  );
};

export const useApi = () => {
  return useContext(clientContext);
};