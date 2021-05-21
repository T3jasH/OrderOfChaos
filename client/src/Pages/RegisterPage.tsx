import React, { useContext, useEffect, useState } from "react";
import "../styles/LoginPage.css";

import { Redirect, useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";

const RegisterPage: React.FC = () => {
  const [email, handleEmail] = useState<string>("");
  const [username, handleUsername] = useState<string>("");
  const [regno, handleRegno] = useState<string>("");
  const [password, handlePassword] = useState<string>("");
  const [confirmPassword, handleConfirmPassword] = useState<string>("");
  const [name, handleName] = useState<string>("");
  const [phoneNo, handlePhoneNo] = useState<string>("");
  const history = useHistory()
  const auth = useContext(AuthContext)

  useEffect(() => {
    if(auth.state.token === null){
      auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : []})
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(password !== confirmPassword){
      auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg : "Passwords do not match"}})
        setTimeout(() => {
            auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg : null}})
            }, 3500)
      return
    }
    const body = {
      email: email,
      name: name,
      regno: regno,
      password: password,
      username: username,
      college: "MIT",
      phoneNo: phoneNo
    };
    // axios.post("/api/users", body)
    // .then(response => console.log(response))
    // .catch(err => console.log(err))
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((data) => {
        console.log(data)
        if(data.success){
          auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg : data.msg}})
        
        }
        else if(data.errors){
          auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg : data.error[0].msg}})

        }
        else{
          auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg : data.msg}})

        }
        setTimeout(() => {
          auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg : null}})
          }, 3500)
      });
  };

  console.log(auth.state.token)

  if(auth.state.token !== null && auth.state.token !== "x"){
    return <Redirect to="/" />
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ORDER OF CHAOS</h2>
        <h3>REGISTER</h3>
        <form onSubmit={(e) => handleSubmit(e)} className="login-form register-form">
          <input
            type="text"
            placeholder="USERNAME"
            name="username"
            onChange={(e) => handleUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="NAME"
            name="name"
            onChange={(e) => handleName(e.target.value)}
          />
          <input
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
          <input
            type="password"
            placeholder="CONFIRM PASSWORD"
            onChange={(e) => handleConfirmPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="REGISTRATION NO"
            name="regno"
            onChange={(e) => handleRegno(e.target.value)}
          />
          <input
            type="text"
            placeholder="PHONE NO"
            name="phoneNo"
            onChange={(e) => handlePhoneNo(e.target.value)}
          />
          <input type="submit" value="REGISTER" className="register-submit-btn" />
        </form>
        
        <button className="btn-login" 
        style={{marginTop : "2.5vh"}}
        onClick={() => {history.push("/login")}}
        >
          ALREADY HAVE AN ACCOUNT?
        </button>
      </div>
    </div> 
  );
};

export default RegisterPage;
