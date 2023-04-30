import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from '@neobase/client/react'
import { Api } from './api.ts'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider api={Api}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
