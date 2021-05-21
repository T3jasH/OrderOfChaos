import React, { useState, useContext, useEffect } from "react";
import "../styles/LoginPage.css";
import {AuthContext} from "../context/AuthContext"
import {AuthActionTypes} from "../context/AuthReducer"
import { Redirect, useHistory } from "react-router-dom";

   
const LoginPage: React.FC = () => {   
  const [email, handleEmail] = useState<string>("");
  const [password, handlePassword] = useState<string>("");
  const [status, handleStatus] = useState<string | null>(null);
  const [loginText, setLoginText] = useState<string>("LOGIN")
  const [loginBtnText, setLoginBtnText] = useState<string>("LOGIN")
  const [pageType, setPageType] = useState<string>("login")
  const auth = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    if(auth.state.token === null){
      auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : []})
    }
    if(auth.state.authAlertMessage){
      handleStatus(auth.state.authAlertMessage)
      setTimeout(() => handleStatus(null), 3000)
    }
  },  [])

  if(auth.state.token !== "x" && auth.state.token !== null){
    return <Redirect to = "/" />
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(pageType === "login"){
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password })
    });

    const data = await response.json();
    console.log(data)
    if(data.success){
      auth.dispatch({type : AuthActionTypes.LOGIN, payload : { token : data.data.token} })
      history.push("/")
    }
    else if(data.errors){
      handleStatus(data.errors[0].msg)
      setTimeout(() => handleStatus(null), 5000)
    }
    else {
      handleStatus(data.msg)
      setTimeout(() => handleStatus(null), 5000)
    }
    }

    else if(pageType === "forgotPassword"){
      const response = await fetch("/api/users/forgotpassword", {
        method: "POST",
        body: JSON.stringify({email: email}),
        headers: {
          "Content-type" : "application/json",
        }
      })
      const data = await response.json()
      handleStatus(data.msg)
      setTimeout(() => handleStatus(null), 5000)
    }
    else{
      const response = await fetch("/api/users/resendEmail", {
        method: "POST",
        body: JSON.stringify({email: email}),
        headers: {
          "Content-type": "application/json"
        }
      })
      const data = await response.json()
      handleStatus(data.msg)
      setTimeout(() => handleStatus(null), 5000)
    }
  };

  const handleForgotPassword = () => {
    setPageType("forgotPassword")
    document.getElementById("password")?.setAttribute("style", "display : none;")
    document.getElementById("login-text")?.setAttribute("style", "letter-spacing : 0em;");
    var btns = document.getElementsByClassName("btn-login");
    for(var i=0; i<btns.length; i++){
      btns[i]?.setAttribute("style", "display: none")
    }
    setLoginBtnText("SUBMIT")
    setLoginText("Enter your email ID")
  }

  const handleVerification = () => {
    document.getElementById("password")?.setAttribute("style", "display : none;")
    document.getElementById("login-text")?.setAttribute("style", "letter-spacing : 0em;");
    var btns = document.getElementsByClassName("btn-login");
    for(var i=0; i<btns.length; i++){
      btns[i]?.setAttribute("style", "display: none")
    }
    setPageType("verification")
    setLoginBtnText("SUBMIT")
    setLoginText("Enter your email ID")
  }

  return (
    <div className="login-page">
      <div className="status-container">
            <p 
            className="login-status"
            style={{display : status === null ? "none" : "flex"}}>
                {status}
            </p>
      </div>
      <div className="login-container">
        <h2>ORDER OF CHAOS</h2>
         <h3 id="login-text">
           {loginText}
         </h3>
        <form onSubmit={(e) => handleSubmit(e)} className="login-form">
          <input
            type="text"
            placeholder="EMAIL"
            name="email"
            onChange={(e) => handleEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="PASSWORD"
            onChange={(e) => handlePassword(e.target.value)}  
          />
          <input type="submit" value={loginBtnText} className="login-submit-btn"/>
        </form>
        <button 
        id="forgot-password"
        className="btn-login" style={{marginTop : "7vh"}}
        onClick={handleForgotPassword}
        >
          FORGOT PASSWORD?
        </button>
        <button 
        id="verification"
        className="btn-login" 
        onClick={handleVerification}>
          VERIFICATION  NOT SENT?
        </button>
        <button className="btn-login" 
        onClick={
          e => history.push("/register")
        }
          >
          SIGN UP
        </button>
        <button 
        className="btn-login"
        onClick={e => {
          history.push("/rules")} }  
        >
          RULES
        </button>
      </div>
    </div>
  );
};



export default LoginPage;
