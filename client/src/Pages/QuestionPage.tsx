import React, { useEffect, useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { PlayerContext } from "../context/PlayerContext"
import { Redirect, useHistory, useParams } from "react-router-dom"
import { getUser, Loading } from "../utils"
import CopyToClipboard from "react-copy-to-clipboard"
import rehypeRaw from "rehype-raw"
import ReactMarkdown from "react-markdown"

// import markdown from "../components/sampleQuestion"

import "../styles/QuestionPage.css"

import Navbar from "../components/Navbar"

// import { getLeaderboard } from "../utils"

import QuestionInfo from "../components/QuestionInfo"

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
    attempts: number
    isSolved: boolean
}

const QuestionPage = () => {
    const auth = useContext(AuthContext)
    const player = useContext(PlayerContext)

    const [userAnswer, setUserAnswer] = useState<string>("")
    const [questionData, setQuestionData] = useState<IQuestion | null>(null)
    const [attemptsState, setAttemptState] = useState<number | undefined>(0)
    const [attemptsStatus, setAttemptsStatus] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [locked, setLocked] = useState<boolean>(false)

    const history = useHistory()

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
            getUser(auth, player)
        }
    })

    useEffect(() => {
        if (auth.state.isStarted === false) {
            setLoading(false)
            return
        }

        if (auth.state.token) {
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
                            attempts: data.data.attempts,
                            isSolved: data.data.isSolved,
                        })
                        setAttemptState(data.data.attempts)
                    } else {
                        setLocked(true)
                    }
                })
                .catch((e) => {
                    console.log(e)

                    console.log("Am i getting an error")
                })
        }
        // eslint-disable-next-line
    }, [auth.state])

    useEffect(() => {
        if (questionData) {
            setLoading(false)
        }
    }, [questionData])

    useEffect(() => {
        if (questionData?.isSolved) {
            setAttemptsStatus("Question has already been solved.")
            return
        }
        if (questionData?.difficulty && attemptsState !== undefined) {
            if (questionData?.difficulty - attemptsState > 0) {
                if (player.state.attacksLeft === 3) {
                    setAttemptsStatus("You already have 3 attacks.")
                } else {
                    setAttemptsStatus(
                        ` ${
                            questionData?.difficulty - attemptsState
                        } attempts left to get an attack.`
                    )
                }
            } else {
                setAttemptsStatus(`No more attempts left to get an attack.`)
            }
        }
        // eslint-disable-next-line
    }, [attemptsState, questionData?.difficulty])

    const { id }: any = useParams()

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
                        setAttemptState(
                            attemptsState !== undefined
                                ? attemptsState + 1
                                : undefined
                        )
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "fail" },
                        })
                    } else {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
                        })
                        setAttemptsStatus("Question has been solved")
                    }

                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3000)
                })
                .catch((e) => {
                    console.log(e)
                })
        }
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
            <div className="question-container" style={{ userSelect: "none" }}>
                <button onClick={() => history.push("/")}>{"<Back"}</button>
                <h3>{questionData?.name}</h3>
                <QuestionInfo
                    questionData={questionData}
                    attacksAvailable={player.state.attacksLeft}
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
                    <div className="answer-info">
                        <div id="attempts-left">{attemptsStatus}</div>
                    </div>
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
