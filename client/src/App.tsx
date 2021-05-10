import React from "react";
import { Route } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import MailVerificationPage from "./Pages/MailVerificationPage";
import QuestionsPage from "./Pages/QuestionsPage";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import QuestionPage from "./Pages/QuestionPage";

const App: React.FC = () => {
  return (
    <div className="code-event">
      <Route path="/leaderboard" component={() => <LeaderboardPage />} />
      <Route path="/register" component={() => <RegisterPage />} />
      <Route path="/login" component={() => <LoginPage />} />
      <Route path="/question/:id" component={() => <QuestionPage />} />
      <Route
        path="/confirmation/:token"
        component={() => <MailVerificationPage />}
      />
      <Route path="/admin" component={() => <AdminPage />} />
      <Route path="/" exact component={() => <QuestionsPage />} />
    </div>
  );
};

export default App;
