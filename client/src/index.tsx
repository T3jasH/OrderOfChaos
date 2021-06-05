import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter as Router } from "react-router-dom"
import AuthProvider from "./context/AuthContext"
import QuestionListProvider from "./context/QuestionContext"
import PlayerProvider from "./context/PlayerContext"
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
// import { GoogleReCaptchaProvider } from '../src/google-recaptcha-provider';
// import { GoogleRecaptchaExample } from './google-recaptcha-example';
// import { WithGoogleRecaptchaExample } from './with-google-recaptcha-example';


ReactDOM.render(
    <Router>
        <GoogleReCaptchaProvider useRecaptchaNet reCaptchaKey = '6LcIPhIbAAAAAG4Rn8C5IkFd5pkCTsjuHBkHG2iV'
            scriptProps={{ async: true, defer: true, appendTo: 'body' }} 
        >
        <AuthProvider>
            <PlayerProvider>
                <QuestionListProvider>
                    <App />
                </QuestionListProvider>
            </PlayerProvider>
        </AuthProvider>
        </GoogleReCaptchaProvider>
    </Router>,
    document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
