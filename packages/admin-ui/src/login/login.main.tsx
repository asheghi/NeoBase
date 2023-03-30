import React from 'react'
import ReactDOM from 'react-dom'
import {AppWrapper} from "./AppWrapper";
import {LoginPage} from "./LoginPage";

ReactDOM.render(
    <React.StrictMode>
       <AppWrapper>
           <LoginPage />
       </AppWrapper>
    </React.StrictMode>,
    document.getElementById('app-root')
)