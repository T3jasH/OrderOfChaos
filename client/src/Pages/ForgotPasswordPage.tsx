import React, { useState } from "react";
import "../styles/RegisterPage.css";
import axios from "axios";

import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const [email, handleEmail] = useState<string>("");
  const [status, handleStatus] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      email: email,
    };
    // axios.post("/api/users", body)
    // .then(response => console.log(response))
    // .catch(err => console.log(err))
    fetch("/api/users/forgotpassword", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
      .then((data) => {
        if (data.errors) {
          console.log(data.errors[0]);
          handleStatus(data.errors[0].msg);
        } else if (data.success) {
          handleStatus(data.msg);
        } else if (data.msg === "User already exists") {
          handleStatus(data.msg);
        }
        console.log(data);
      });
  };

  return (
    <div className="register-page">
      <div className="container">
        <h3>Forgot Password</h3>
        <Link to="/login">Go Back</Link>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={(e) => handleEmail(e.target.value)}
          />
          <input type="submit" value="submit" />
        </form>
        {status ? <b>{status}</b> : null}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
