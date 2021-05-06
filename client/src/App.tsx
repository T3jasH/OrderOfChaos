import React from "react";
import { Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import MailVerificationPage from "./Pages/MailVerificationPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <div className="code-event">
      <Navbar />
      <Route path="/login" exact render={() => <LoginPage />} />
      <Route
        path="/forgot-password"
        exact
        render={() => <ForgotPasswordPage />}
      />
      <Route path="/" exact render={() => <RegisterPage />} />
      <Route
        path="/confirmation/:token"
        render={() => <MailVerificationPage />}
      />
    </div>
  );
};

export default App;
