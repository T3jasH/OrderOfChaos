import React, { useEffect } from "react"
import { Route, Switch } from "react-router-dom"
import RegisterPage from "./Pages/RegisterPage"
import MailVerificationPage from "./Pages/MailVerificationPage"
import QuestionsPage from "./Pages/QuestionsPage"
import LoginPage from "./Pages/LoginPage"
import AdminPage from "./Pages/AdminPage"
import LeaderboardPage from "./Pages/LeaderboardPage"
import QuestionPage from "./Pages/QuestionPage"
import RulesPage from "./Pages/RulesPage"
import NotFoundPage from "./Pages/NotFoundPage"
import ResetPassword from "./Pages/ResetPassword"
import { SendAlert } from "./utils"
const App: React.FC = () => {

    useEffect(() => {
        if(!document.getElementById("logo-icon")){
            var link = document.createElement("link")
            link.id="logo-icon"
            link.rel="icon"
            console.log(window.matchMedia('(prefers-color-scheme: dark)'))
            link.href= window.matchMedia('(prefers-color-scheme: dark)').matches? "/LogoIcon.svg" : "/LogoIconBright.svg"
            document.head.appendChild(link)
            console.log("Loaded icon")
        }
    }, [])

    return (
        <div className="code-event">
            <SendAlert />
            <Switch>
                <Route
                    path="/leaderboard"
                    component={() => (
                        <LeaderboardPage currentPage="leaderboard" />
                    )}
                />
                <Route
                    path="/attackers"
                    component={() => (
                        <LeaderboardPage currentPage="attackers" />
                    )}
                />
                <Route path="/register" component={() => <RegisterPage />} />
                <Route path="/login" component={() => <LoginPage />} />
                <Route
                    path="/resetpassword/:token"
                    component={() => <ResetPassword />}
                />
                <Route
                    path="/question/:id"
                    component={() => <QuestionPage />}
                />
                <Route
                    path="/confirmation/:token"
                    component={() => <MailVerificationPage />}
                />
                <Route path="/admin" component={() => <AdminPage />} />
                <Route path="/" exact component={() => <QuestionsPage />} />
                <Route path="/rules" component={() => <RulesPage />} />
                <Route component={() => <NotFoundPage />} />
            </Switch>
        </div>
    )
}

export default App
