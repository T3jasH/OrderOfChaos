import React, { useEffect, useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { PlayerContext } from "../context/PlayerContext"
import { Redirect, useHistory, useParams } from "react-router-dom"
import { getUser, getLeaderboard, Loading, updateScore } from "../utils"
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
    const [attemptsToGetAttack, setAttemptsData] = useState<number>(-1)
    const [attemptsStatus, setAttemptsStatus] = useState<string>("")
    const [rank, setRank] = useState<number | null>(null)
    const [locked, setLocked] = useState<boolean>(false)
    const [btnDisable, setBtnDisable] = useState<boolean>(false)

    const history = useHistory()

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
    })

    // Get user (score, attacks left) 
    // Get question
    // Only token needed
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

    //updateRank needs ID of player so check auth.state.id
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
            getLeaderboard(auth)
                    .then(data => {
                        setRank(data.playerRank)
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

    // Set message at bottom of page, to let user know if they can get an attack
    useEffect(() => {
        if (questionData?.isSolved === true){
            document.getElementById("scroll-top")?.scrollIntoView()
            setAttemptsStatus("You have solved this question")
            return
        }
       if(attemptsToGetAttack > 0){
            if(player.state.attacksLeft === 3){
                setAttemptsStatus("You have 3 attacks already, you can't get an attack")
            }
            else{
                setAttemptsStatus(`${attemptsToGetAttack} attempt${attemptsToGetAttack === 1 ? "" : "s"} remaining to get an attack.`)
            }
       }
       else{
           setAttemptsStatus("You can't get an attack")
       }
        // eslint-disable-next-line
    }, [attemptsToGetAttack, questionData?.isSolved])


    useEffect(() => {
        if (questionData && loading === true)  {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [questionData])

    const { id }: any = useParams()

    const handleAnswerSubmit = () => {
        if(btnDisable === true){
            return;
        }
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
        if (userAnswer==='') {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Please enter an answer", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        if(questionData?.isSolved===true)
        {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Already Solved", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        setBtnDisable(true)
        setTimeout(() => setBtnDisable(false), 1500)
        if (auth.state.token) {
            fetch(`/api/question/${id}`, {
                method: "POST",
                headers: {
                    "x-auth-token": auth.state.token,
                    "Content-type": "application/json",
                },

                body: JSON.stringify({ answer: userAnswer.trim() }),
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
                    } else {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
                        })
                        if (questionData !== null){
                            updateScore(questionData.points,false, player);
                            setQuestionData((prevQuestionData:any) => {
                               return  {
                                   ...prevQuestionData,
                                    isSolved: true
                                }
                             } )
                        }
                        if (data.attackAdded === true) {
                            player.dispatch({
                                type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
                                payload: {
                                    attacksLeft: player.state.attacksLeft + 1,
                                },
                            })
                        }
                    }
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3000)
                    getLeaderboard(auth)
                    .then(data => {
                        setRank(data.playerRank)
                    })
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }

    

    if (locked) {
        return <Redirect to="/" />
    }

    if(auth.state.token === "x"){
        return <Redirect to="/login" />
    }

    if (loading) return <Loading />

    if (auth.state.isStarted === false && auth.state.isAdmin === false) {
        return <Redirect to="/rules" />
    }

    return (
        <div className="question-page">
            <h3 className="mobile-message">
                Switch to PC for a better experience
            </h3>
            <Navbar removeButton={false} scrollId="question-container" />
            <PlayerInfoFooter active={false} rank={rank} />
            <div className="question-container"
                 id="question-container"
            style={{ userSelect: "none" }}>
                <button onClick={() => history.push("/")} id="scroll-top">{"<Back"}</button>
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
                    <b>
                        {attemptsStatus}
                    </b>
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
                            auth.state.isEnded || btnDisable ? "disable-button" : "" 
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
