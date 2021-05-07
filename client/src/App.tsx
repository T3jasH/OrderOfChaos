import React from 'react';
import {Route} from "react-router-dom"
import RegisterPage from "./Pages/RegisterPage"
import MailVerificationPage from "./Pages/MailVerificationPage"
import QuestionPage from './Pages/QuestionsPage';
import LoginPage from './Pages/LoginPage';

const App: React.FC = () => {
  return (
    <div className="code-event">
      <Route path="/register" render = {() => <RegisterPage/>}  />
      <Route path="/login" render={() => <LoginPage/>} />
      <Route path="/confirmation/:token" render = {() => <MailVerificationPage/>} />
      <Route path="/" exact render = {() => <QuestionPage/>} />
    </div>
  );
}

export default App;
