import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from "./App";
import { AuthProvider } from '@neobase/client/react';
import { Api } from '../lib/api';

ReactDOM.createRoot(document.getElementById('app-root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider api={Api}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
