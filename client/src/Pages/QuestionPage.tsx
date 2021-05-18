import React, { useEffect, useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { PlayerContext } from "../context/PlayerContext"
import { useHistory, useParams } from "react-router-dom"
import { getUser } from "../utils"
import rehypeRaw from "rehype-raw"
import ReactMarkdown from "react-markdown"

import markdown from "../components/sampleQuestion"

import "../styles/QuestionPage.css"

import Navbar from "../components/Navbar"

import { getLeaderboard } from "../utils"

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
    _id: string
}

const QuestionPage = () => {
    const auth = useContext(AuthContext)
    const player = useContext(PlayerContext)

    const [userAnswer, setUserAnswer] = useState<string>("")
    const [questionData, setQuestionData] = useState<IQuestion | null>(null)

    const [submitMessage, setSubmitMessage] = useState<string>("")

    const [rank, setRank] = useState<number | null>(null)

    const history = useHistory()

    useEffect(() => {
        if (auth.state.id.length) {
            getLeaderboard(auth).then((data) => {
                setRank(
                    data.findIndex((user: any) => user._id === auth.state.id) +
                        1
                )
            })
        }
    }, [auth.state.id])
    useEffect(() => {
        console.log("LOGGING AUTH")
        console.log(auth)
        console.log(auth.state.token)
        console.log("IS THIS GETTING CALLED")
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
                    console.log("printing data:")
                    setQuestionData(data.data.question)
                    console.log(typeof questionData?.statement)
                    auth.dispatch({
                        type: AuthActionTypes.SET_LOADING,
                        payload: [],
                    })
                    console.log(data)
                })
                .catch((e) => {
                    console.log(e)

                    console.log("Am i getting an error")
                })
        }
    }, [auth.state.token])

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
            getUser(auth)
        }
    })

    const { id }: any = useParams()

    const handleAnswerSubmit = () => {
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
                .then((data) => {
                    console.log("printing data:")
                    console.log(data)
                    setSubmitMessage(data.msg)
                })
                .catch((e) => {
                    console.log(e)

                    console.log("Am i getting an error")
                })
        }
    }

    if (auth.state.loading) return <div>loading...</div>
    return (
        <div className="question-page">
            <Navbar />
            <div className="question-container">
                <button onClick={() => history.goBack()}>{"<Back"}</button>
                <h3>{questionData?.name}</h3>
                <QuestionInfo questionData={questionData} />
                {/* {questionData?.statement && (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {questionData?.statement}
                </ReactMarkdown>
                // <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
            )} */}
                <div className="question-markdown">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {markdown}
                    </ReactMarkdown>
                </div>

                <div className="answer-container">
                    <h2>Answer</h2>
                    <div id="attempts-left">
                        Attempts left to get an attack: 1
                    </div>

                    <textarea className="answer-textarea"></textarea>
                    <button className="answer-button">Submit</button>
                </div>
            </div>
        </div>
    )
}
export default QuestionPage

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
