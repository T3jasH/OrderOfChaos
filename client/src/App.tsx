import React from "react";
import { Route, Switch } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import MailVerificationPage from "./Pages/MailVerificationPage";
import QuestionsPage from "./Pages/QuestionsPage";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import QuestionPage from "./Pages/QuestionPage";
import RulesPage from "./Pages/RulesPage";
import NotFoundPage from "./Pages/NotFoundPage"
import ResetPassword from "./Pages/ResetPassword";
const App: React.FC = () => {
  return (
    <div className="code-event">
      <Switch>
      <Route path="/leaderboard" component={() => <LeaderboardPage />} />
      <Route path="/register" component={() => <RegisterPage />} />
      <Route path="/login" component={() => <LoginPage />} />
      <Route path="/resetpassword/:token" component={() => <ResetPassword/>} />
      <Route path="/question/:id" component={() => <QuestionPage />} />
      <Route
        path="/confirmation/:token"
        component={() => <MailVerificationPage />}
      />
      <Route path="/admin" component={() => <AdminPage />} />
      <Route path="/" exact component={() => <QuestionsPage />} />
      <Route path="/rules" component={() => <RulesPage/>} />
      <Route component={() => <NotFoundPage/>} />
      </Switch>
    </div>
  );
};

export default App;
