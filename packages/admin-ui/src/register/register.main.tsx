import React from 'react'
import ReactDOM from 'react-dom'
import {AppWrapper} from "./AppWrapper";
import {RegisterPage} from "./RegisterPage";

ReactDOM.render(
    <React.StrictMode>
       <AppWrapper>
           <RegisterPage />
       </AppWrapper>
    </React.StrictMode>,
    document.getElementById('app-root')
)