import React from 'react';
import {Route} from "react-router-dom"
import RegisterPage from "./Pages/RegisterPage"
import MailVerificationPage from "./Pages/MailVerificationPage"

const App: React.FC = () => {
  return (
    <div className="code-event">
      <Route path="/" render = {() => <RegisterPage/>}  />
      <Route path="/confirmation/:token" render = {() => <MailVerificationPage/>} />
    </div>
  );
}

export default App;
