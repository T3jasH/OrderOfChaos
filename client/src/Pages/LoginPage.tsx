import React, { useState, useContext, useEffect } from "react";
import "../styles/LoginPage.css";
import {AuthContext} from "../context/AuthContext"
import {AuthActionTypes} from "../context/AuthReducer"
import { Link, Redirect, useHistory } from "react-router-dom";


const LoginPage: React.FC = () => {   
  const [email, handleEmail] = useState<string>("");
  const [password, handlePassword] = useState<string>("");
  const [status, handleStatus] = useState<string | null>(null);
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
    else {
      handleStatus("Invalid credentials")
    }

  };


  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ORDER OF CHAOS</h2>
         <h3>LOGIN</h3>
        <form onSubmit={(e) => handleSubmit(e)} className="login-form">
          <input
            style={{marginTop : "4rem"}}
            type="text"
            placeholder="EMAIL"
            name="email"
            onChange={(e) => handleEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            onChange={(e) => handlePassword(e.target.value)}
          />
          <input type="submit" value="LOGIN" />
        </form>
        
        <button className="btn-login" style={{marginTop : "4rem"}}>
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
        {status ? <b>{status}</b> : null}
      </div>
    </div>
  );
};

export default LoginPage;
