import React, { useState, useContext } from "react";
import "../styles/RegisterPage.css";
import {AuthContext} from "../context/Auth"
import {AuthActionTypes} from "../context/AuthReducer"
import { Link } from "react-router-dom";


const LoginPage: React.FC = () => {
  const [email, handleEmail] = useState<string>("");
  const [password, handlePassword] = useState<string>("");
  const [status, handleStatus] = useState<string | null>(null);
  const auth = useContext(AuthContext)

  

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
      console.log(auth, auth.state)

    }
    else {
      handleStatus(data.msg)
    }

  };

  return (
    <div className="register-page">
      <div className="container">
        <h3>Login</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={(e) => handleEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => handlePassword(e.target.value)}
          />
          <input type="submit" value="submit" />
        </form>

        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Don't have an account?</Link>
        {status ? <b>{status}</b> : null}
      </div>
    </div>
  );
};

export default LoginPage;
