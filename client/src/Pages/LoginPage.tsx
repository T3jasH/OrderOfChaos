import React, { useState } from "react";
import "../styles/RegisterPage.css";

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginPage: React.FC = () => {
  const [email, handleEmail] = useState<string>("");
  const [password, handlePassword] = useState<string>("");
  const [status, handleStatus] = useState<string | null>(null);

  const value = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await value?.login(email, password);
    if (!data.success) handleStatus(data.msg);
    else if (data.success) handleStatus(data.msg);
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
        <Link to="/">Don't have an account?</Link>
        {status ? <b>{status}</b> : null}
      </div>
    </div>
  );
};

export default LoginPage;
