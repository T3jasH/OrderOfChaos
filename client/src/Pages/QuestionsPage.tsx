import React, { useContext, useEffect, useState } from "react"
import { QuestionContext } from "../context/QuestionContext"
import { AuthContext } from "../context/AuthContext"
import { Redirect } from "react-router"
import { getContestDetails, getLeaderboard, Loading } from "../utils"
import "../styles/QuestionsPage.css"
import { AuthActionTypes } from "../context/AuthReducer"
import QuestionListItem from "../components/QuestionListItem"
import { PlayerContext } from "../context/PlayerContext"
import Navbar from "../components/Navbar"
import PlayerInfoFooter from "../components/PlayerInfoFooter"
const QuestionPage: React.FC = () => {
    const questions = useContext(QuestionContext)
    const auth = useContext(AuthContext)
    const player = useContext(PlayerContext)
    const [rank, setRank] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
    })

    useEffect(() => {
        if (auth.state.token !== null && auth.state.token !== "x")
            getContestDetails(auth, questions, player)
            // eslint-disable-next-line
    }, [auth.state.token])

    useEffect(() => {
        if(auth.state.isStarted === false){
            setLoading(false)
            return;
        }
        if (auth?.state?.id?.length && auth.state.token !== "x") {
            getLeaderboard(auth).then((data) => {
                console.log(data.attackers)
                setRank(
                    data.ranks.findIndex(
                        (user: any) => user._id === auth.state.id
                    ) + 1
                )
            })
        }
        // eslint-disable-next-line
    }, [auth.state])

    useEffect(() => {
        if (questions?.state?.length && rank !== null) {
            setLoading(false)
        }
    }, [questions.state, rank])

    if (auth.state.token === "x") {
        return <Redirect to="/login" />
    }

    if (loading) {
        return <Loading />
    }

    if (auth.state.isStarted === false) {
        return <Redirect to="/rules" />
    }

    return (
        <div className="questions-page">
            <Navbar removeButton={false} />
            <h2 className="mobile-message">
                Switch to PC for a better experience
            </h2>
            <div className="questions-container">
                <h3>QUESTIONS</h3>
                {questions.state.map((item, index) => (
                    <QuestionListItem
                        question={item}
                        index={index}
                        key={item.name}
                    />
                ))}
            </div>
            <PlayerInfoFooter active={false} rank={rank} />
        </div>
    )
}

export default QuestionPage
