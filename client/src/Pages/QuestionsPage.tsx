import React, { useContext, useEffect, useState } from "react"
import { QuestionContext} from "../context/QuestionContext"
import {Question, QuestionActionTypes} from "../context/QuestionReducer"
import { AuthContext } from "../context/AuthContext"
import { Redirect } from "react-router"
import { getContestDetails, getLeaderboard, Loading, updateScore } from "../utils"
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
        if (auth?.state?.id?.length !== 0) {
            getLeaderboard(auth).then((data) => {
                // console.log(data.attackers)
                setRank(
                    data.ranks.findIndex(
                        (user: any) => user._id === auth.state.id
                    ) + 1
                )
            })
        }
        // eslint-disable-next-line
    }, [auth.state.id])

    useEffect(() => {
        if (auth.state.isStarted === false && loading === true) {
            setLoading(false)
            return
        }
        // eslint-disable-next-line
    }, [auth.state])

    useEffect(() => { 
        if (questions?.state?.length && rank !== null && loading === true) {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [questions.state, rank])

    const unlockQuestion = (question: Question) => {
        if (
            auth.state.token &&
            player.state.score >= question.unlockCost &&
            question.isLocked
        ) {
            if (auth.state.isEnded) {
                auth.dispatch({
                    type: AuthActionTypes.SET_MESSAGE,
                    payload: { msg: "Contest has ended.", type: "fail" },
                })
                setTimeout(() => {
                    auth.dispatch({
                        type: AuthActionTypes.CLEAR_MESSAGE,
                        payload: {},
                    })
                }, 3000)
                return
            }
            fetch(`/api/question/locked/${question.quesId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": auth.state.token,
                },
            })
                .then((resp) => resp.json())
                .catch((err) => console.log(err))
                .then((data) => {
                    //console.log(data)
                    if (data.success) {
                        questions.dispatch({
                            type: QuestionActionTypes.SET_UNLOCKED,
                            payload: { id: question.quesId },
                        })
                        // for (let i = 0; i < question.unlockCost; i++) {
                        updateScore(question.unlockCost, true, player)
                        // }
                    }
                    auth.dispatch({
                        type: AuthActionTypes.SET_MESSAGE,
                        payload: {
                            msg: `Unlocked question ${question.quesId}.`,
                            type: "success",
                        },
                    })
                    getLeaderboard(auth)
                    .then(data => setRank(data.playerRank))
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3000)
                })
        }
    }

    if (auth.state.token === "x") {
        return <Redirect to="/login" />
    }

    if (loading) {
        return <Loading />
    }

    if (auth.state.isStarted === false  && auth.state.isAdmin === false) {
        return <Redirect to="/rules" />
    }

    return (
        <div className="questions-page">
            <Navbar removeButton={false} scrollId="questions-container" />
            <h2 className="mobile-message">
                Switch to PC for a better experience
            </h2>
            <div className="questions-container" 
                id="questions-container">
                <h3>QUESTIONS</h3>
                {questions.state.map((item, index) => (
                    <QuestionListItem
                        unlockQuestion={unlockQuestion}
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
