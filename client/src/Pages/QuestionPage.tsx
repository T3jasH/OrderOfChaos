import React, { useEffect, useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { PlayerContext } from "../context/PlayerContext"
import { Redirect, useHistory, useParams } from "react-router-dom"
import { getUser, getLeaderboard, Loading } from "../utils"
import CopyToClipboard from "react-copy-to-clipboard"
import rehypeRaw from "rehype-raw"
import ReactMarkdown from "react-markdown"

// import markdown from "../components/sampleQuestion"

import "../styles/QuestionPage.css"

import Navbar from "../components/Navbar"

// import { getLeaderboard } from "../utils"

import QuestionInfo from "../components/QuestionInfo"
import PlayerInfoFooter from "../components/PlayerInfoFooter"
import { PlayerActionTypes } from "../context/PlayerReducer"

export interface IQuestion {
    constraints: string
    inpFormat: string
    name: string
    outFormat: string
    penalty: number
    points: number
    quesId: number
    samInput: string
    samOutput: string
    statement: string
    tags: string[]
    testcase: string
    unlockCost: number
    difficulty: number
    solved: number
    _id: string
    isSolved: boolean
}

const QuestionPage = () => {
    const auth = useContext(AuthContext)
    const player = useContext(PlayerContext)

    const [userAnswer, setUserAnswer] = useState<string>("")
    const [questionData, setQuestionData] = useState<IQuestion | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [attemptsToGetAttack, setAttemptsData] = useState<number>(0)
    const [rank, setRank] = useState<number | null>(null)
    const [locked, setLocked] = useState<boolean>(false)

    const history = useHistory()

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
    })

    useEffect(() => {
        if (auth.state.token !== "x" && auth.state.token !== null) {
            getUser(auth, player)
            fetch(`/api/question/${id}`, {
                method: "GET",
                headers: {
                    "x-auth-token": auth.state.token,
                    "Content-type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setQuestionData({
                            ...data.data.question,
                            isSolved: data.data.isSolved,
                        })
                        setAttemptsData(
                            data.data.isSolved
                                ? 0
                                : data.data.attempts >=
                                  data.data.question.difficulty
                                ? 0
                                : data.data.question.difficulty -
                                  data.data.attempts
                        )
                    } else {
                        setLocked(true)
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        // eslint-disable-next-line
    }, [auth.state.token])

    useEffect(() => {
        if (auth.state.isStarted === false) {
            setLoading(false)
            return
        }
        if (
            auth?.state?.id?.length &&
            auth.state.token !== "x" &&
            rank === null
        ) {
            updateRank()
        }

        // eslint-disable-next-line
    }, [auth.state])

    useEffect(() => {
        if (questionData) {
            setLoading(false)
        }
    }, [questionData])

    const { id }: any = useParams()

    const updateScore = (x: Number, decr: boolean) => {
        var i = 1,
            k = player.state.score
        if (decr) {
            var interval = setInterval(() => {
                player.dispatch({
                    type: PlayerActionTypes.UPDATE_SCORE,
                    payload: {
                        score: k - i,
                    },
                })
                i++
                if (i > x) clearInterval(interval)
            }, 20)
        }
        else{
            var interval1 = setInterval( () => {
                player.dispatch({
                       type: PlayerActionTypes.UPDATE_SCORE,
                       payload: {
                           score: k + i,
                       },
                   })
                   i++
                   if (i > x) clearInterval(interval1)
               }, 10)
        }
    }

    const handleAnswerSubmit = () => {
        if (auth.state.isEnded) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Contest has ended", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        if (auth.state.token) {
            fetch(`/api/question/${id}`, {
                method: "POST",
                headers: {
                    "x-auth-token": auth.state.token,
                    "Content-type": "application/json",
                },

                body: JSON.stringify({ answer: userAnswer }),
            })
                .then((response) => response.json())
                .catch((err) => console.log(err))
                .then((data) => {
                    if (!data.success) {
                        setAttemptsData(
                            attemptsToGetAttack - 1 > 0
                                ? attemptsToGetAttack - 1
                                : 0
                        )
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "fail" },
                        })
                        if (questionData && data.msg==="Wrong answer.")
                            updateScore(questionData?.penalty,true);
                    } else {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
                        })
                        if (questionData)
                            updateScore(questionData.points,false);
                        if (data.attackAdded === true) {
                            player.dispatch({
                                type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
                                payload: {
                                    attacksLeft: player.state.attacksLeft + 1,
                                },
                            })
                        }
                        setAttemptsData(0)
                    }
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3000)
                    updateRank()
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    const updateRank = () => {
        getLeaderboard(auth).then((data) => {
            // console.log(data.attackers)
            setRank(
                data.ranks.findIndex(
                    (user: any) => user._id === auth.state.id
                ) + 1
            )
        })
    }

    if (locked) {
        return <Redirect to="/" />
    }

    if (loading) return <Loading />

    if (auth.state.isStarted === false) {
        return <Redirect to="/rules" />
    }

    return (
        <div className="question-page">
            <h3 className="mobile-message">
                Switch to PC for a better experience
            </h3>
            <Navbar removeButton={false} />
            <PlayerInfoFooter active={false} rank={rank} />
            <div className="question-container" style={{ userSelect: "none" }}>
                <button onClick={() => history.push("/")}>{"<Back"}</button>
                <h3>{questionData?.name}</h3>
                <QuestionInfo
                    questionData={questionData}
                    attemptsToGetAttack={attemptsToGetAttack}
                />
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    children={String(questionData?.statement)}
                />

                <br />
                <h2>Constraints</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.constraints)}
                </ReactMarkdown>
                <br />
                <h2>Input Format</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.inpFormat)}
                </ReactMarkdown>
                <br />
                <h2>Output Format</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.outFormat)}
                </ReactMarkdown>
                <br />
                <h2>
                    Sample Input
                    <CopyToClipboard
                        text={
                            questionData?.samInput.slice(4, -4)
                                ? questionData?.samInput.slice(4, -4)
                                : ""
                        }
                    >
                        <button
                            className="copy-btn"
                            onClick={() => {
                                auth.dispatch({
                                    type: AuthActionTypes.SET_MESSAGE,
                                    payload: {
                                        msg: "Copied!",
                                        type: "success",
                                    },
                                })
                                setTimeout(() => {
                                    auth.dispatch({
                                        type: AuthActionTypes.CLEAR_MESSAGE,
                                        payload: {},
                                    })
                                }, 3000)
                            }}
                        >
                            <i className="far fa-copy"></i>
                        </button>
                    </CopyToClipboard>
                </h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.samInput)}
                </ReactMarkdown>
                <br />
                <h2>Sample Output</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.samOutput)}
                </ReactMarkdown>
                <br />
                <h2>
                    Testcase
                    <CopyToClipboard
                        text={
                            questionData?.testcase.slice(4, -4)
                                ? questionData?.testcase.slice(4, -4)
                                : ""
                        }
                    >
                        <button
                            className="copy-btn"
                            onClick={() => {
                                auth.dispatch({
                                    type: AuthActionTypes.SET_MESSAGE,
                                    payload: {
                                        msg: "Copied!",
                                        type: "success",
                                    },
                                })
                                setTimeout(() => {
                                    auth.dispatch({
                                        type: AuthActionTypes.CLEAR_MESSAGE,
                                        payload: {},
                                    })
                                }, 3000)
                            }}
                        >
                            <i className="far fa-copy"></i>
                        </button>
                    </CopyToClipboard>
                </h2>
                <div className="testcase-container">
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        children={String(questionData?.testcase)}
                    />
                </div>

                <div className="answer-container">
                    <h2 style={{ marginBottom: "0.5rem" }}>Answer</h2>
                    {player.state.attacksLeft === 3 &&
                    attemptsToGetAttack !== 0 ? (
                        <p className="attack-warning">
                            You have 3 attacks, you won't get an attack on
                            correct submission
                        </p>
                    ) : (
                        ""
                    )}
                    <textarea
                        className="answer-textarea"
                        onChange={(e) => {
                            setUserAnswer(e.target.value)
                        }}
                    ></textarea>
                    <button
                        onClick={() => {
                            handleAnswerSubmit()
                        }}
                        className={`answer-button ${
                            auth.state.isEnded ? "disable-button" : ""
                        }`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}
export default QuestionPage

// eslint-disable-next-line
{
    /* <textarea
                    cols={30}
                    rows={10}
                    onChange={(e) => setUserAnswer(e.target.value)}
                >
                    Put your output here
                </textarea>
                <button
                    style={{ backgroundColor: "cyan" }}
                    onClick={handleAnswerSubmit}
                >
                    Submit Wisely
                </button>
                {submitMessage !== "" && <div>{submitMessage}</div>} */
}
