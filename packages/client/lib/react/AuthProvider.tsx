import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiType } from '../api';


type ContextType = {
  user: any;
  loading: boolean;
  connected: boolean;
  api: ApiType | undefined;
  fetchUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<ContextType>({
  user: undefined,
  loading: false,
  connected: false,
  api: undefined,
  fetchUser: () => { },
  logout: () => { },
});

export const useAuth = () => {
  return useContext(AuthContext);
}

export enum AuthState {
  Initializing = 'initalizing',
  Loading = 'loading',
  LoggedIn = 'loggedin',
  NoAuth = 'noauth',
}


export const AuthProvider = (props: { children: React.ReactNode, api: ApiType }) => {
  const socket = props.api.getSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [authState, setAuthState] = useState(AuthState.Initializing);
  const [user, setUser] = useState<any>();


  const initalizeSocket = (userId) => {
    function onConnect() {
      console.log('on connect');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('on disconnect');
      setIsConnected(false);
    }

    function onAuthChange(value) {
      if (value === 'logout') {
        setUser(undefined);
        setAuthState(AuthState.NoAuth);
      }
    }

    const authChannel = 'auth-' + userId;

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(authChannel, onAuthChange);
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(authChannel, onAuthChange);
    };
  }

  const fetchUser = () => {
    props.api.Auth.me()
      .then(({ data }) => {
        setUser(data);
        setAuthState(AuthState.LoggedIn);
        initalizeSocket(data.id);
      })
      .catch(e => {
        setAuthState(AuthState.NoAuth);
        console.error('auth failed with error:', e);
      });
  }


  const logout = () => {
    return props.api.Auth.logout()
      .then(() => {
        setUser(undefined);
        setAuthState(AuthState.NoAuth)
        return Promise.resolve;
      })
  }

  const contextValue: ContextType = {
    user,
    loading: authState === AuthState.Loading || authState === AuthState.Initializing,
    connected: isConnected,
    api: props.api,
    fetchUser,
    logout,
  };

  useEffect(() => {
    if (authState !== AuthState.Initializing) {
      console.error('Ridi!, Auth provider should not be called with state:' + authState);
      return;
    }
    fetchUser();
  }, [props,])

  return <AuthContext.Provider value={contextValue}>
    {props.children}
  </AuthContext.Provider>
}