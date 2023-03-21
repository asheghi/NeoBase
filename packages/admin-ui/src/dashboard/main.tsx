import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {AppWrapper} from "../lib";

ReactDOM.createRoot(document.getElementById('app-root') as HTMLElement).render(
  <React.StrictMode>
      <AppWrapper>
        <App />
      </AppWrapper>
  </React.StrictMode>,
)
