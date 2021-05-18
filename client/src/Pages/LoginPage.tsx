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
  const auth = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    if(auth.state.token === null){
      auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : []})
    }
  },  [])

  if(auth.state.token !== "x" && auth.state.token !== null){
    return <Redirect to = "/" />
  }
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(loginText === "LOGIN"){
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
      handleStatus(null)
      auth.dispatch({type : AuthActionTypes.LOGIN, payload : { token : data.data.token} })
      history.push("/")
    }
    else if(data.errors){
      handleStatus(data.errors[0].msg)
    }
    else {
      handleStatus(data.msg)
    }
    }
    else{
      const response = await fetch("/api/users/forgotpassword", {
        method: "POST",
        body: JSON.stringify({email: email}),
        headers: {
          "Content-type" : "application/json",
        }
      })
      const data = await response.json()
      handleStatus(data.msg)
    }
  };

  const handleForgotPassword = () => {
    document.getElementById("password")?.setAttribute("style", "display : none;")
    document.getElementById("login-text")?.setAttribute("style", "letter-spacing : 0em;");
    document.getElementById("login-status")?.setAttribute("style", "top: 21.5rem; color: #fff;")
    handleStatus(null)
    setLoginBtnText("SUBMIT")
    setLoginText("Enter your email ID")
  }


  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ORDER OF CHAOS</h2>
         <h3 id="login-text">
           {loginText}
         </h3>
        <form onSubmit={(e) => handleSubmit(e)} className="login-form">
          <input
            style={{marginTop : "4rem"}}
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
          <input type="submit" value={loginBtnText}/>
        </form>
       <p className="login-status" id="login-status" style={{display: status? "block" : "none"}}>
         {status}
          </p> 
        <button 
        className="btn-login" style={{marginTop : "4rem"}}
        onClick={handleForgotPassword}
        >
          FORGOT PASSWORD?
        </button>
        <button className="btn-login" 
        style={{
          marginTop: "1.5rem",
          fontWeight: "bold" 
          }}
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
        style={{marginTop: "1.5rem",}}
        >
          RULES
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
