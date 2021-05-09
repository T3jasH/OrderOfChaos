import React from 'react';
import {Route} from "react-router-dom"
import RegisterPage from "./Pages/RegisterPage"
import MailVerificationPage from "./Pages/MailVerificationPage"
import QuestionPage from './Pages/QuestionsPage';
import LoginPage from './Pages/LoginPage';
import AdminPage from './Pages/AdminPage';

const App: React.FC = () => {
  return (
    <div className="code-event">
      <Route path="/register" component = {() => <RegisterPage/>}  />
      <Route path="/login" component = {() => <LoginPage/>} />
      <Route path="/confirmation/:token" component = {() => <MailVerificationPage/>} />
      <Route path="/admin" component = {() => <AdminPage/>} />
      <Route path="/" exact component = {() => <QuestionPage/>} />
    </div>
  );
}

export default App;
