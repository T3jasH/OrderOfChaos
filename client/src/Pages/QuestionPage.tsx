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
    solved: number
    _id: string
    attempts: number
}


const QuestionPage = () => {
    const auth = useContext(AuthContext)
    const player = useContext(PlayerContext)

    const [userAnswer, setUserAnswer] = useState<string>("")
    const [questionData, setQuestionData] = useState<IQuestion | null>(null)
    const [submitMessage, setSubmitMessage] = useState<string>("")
    const [rank, setRank] = useState<number | null>(null)
    const [attemptsState, setAttemptState] = useState<number | undefined>(0)
    const [loading, setLoading] = useState<boolean>(true)

    const history = useHistory()

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
            getUser(auth)
        }
    })

    useEffect(() => {
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
                    setQuestionData({ ...data.data.question, attempts: data.data.attempts})
                    setAttemptState(data.data.attempts)
                    console.log(typeof questionData?.statement)
                    console.log(data.data.question, data.data.attempts)
                    console.log(data)
                })
                .catch((e) => {
                    console.log(e)

                    console.log("Am i getting an error")
                })
        }
    }, [auth.state.token])

    useEffect(() => {
        if(questionData){
            setLoading(false)
        }
    }, [questionData])


    
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
                .catch(err => console.log(err))
                .then((data) => {
                    console.log(data)
                    if(!data.success){
                        setAttemptState(attemptsState!==undefined? attemptsState + 1 : undefined)
                    }
                    setSubmitMessage(data.msg)
                    setTimeout(() => setSubmitMessage(""), 3000)
                })
                .catch((e) => {
                    console.log(e)

                    console.log("Am i getting an error")
                })
        }
    }

    const CopyToClipboard = (text: string | undefined) => {
        const ta = document.createElement("textarea")
        if (text) ta.innerText = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand("copy")
        ta.remove()
        setSubmitMessage("Copied to clipboard")
        setTimeout(() => setSubmitMessage(""), 1500)
    }

    if (loading) return <div>loading...</div>
    return (
        <div className="question-page">
            <div className="status-container">
            <p 
            className="submit-status"
            style={{display : submitMessage === "" ? "none" : "flex"}}>
                {submitMessage}
            </p>
            </div>
            <h3 className="mobile-message" >Switch to PC for a better experience</h3>
            <Navbar />
            <div className="question-container">
                <button onClick={() => history.goBack()}>{"<Back"}</button>
                <h3>{questionData?.name}</h3>
                <QuestionInfo
                    questionData={questionData}
                    attacksAvailable={player.state.attacksLeft}
                />
                {/* {questionData?.statement && (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {questionData?.statement}
                </ReactMarkdown>
                // <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
            )} */}
                <div className="question-markdown">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {String(questionData?.statement)}
                    </ReactMarkdown>
                </div>
                <br/>
                <h2>
                    Constraints
                </h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.constraints)}
                </ReactMarkdown>
                <br/>
                <h2>Input Format</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.inpFormat)}
                </ReactMarkdown>
                <br/>
                <h2>Output Format</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.outFormat)}
                </ReactMarkdown>
                <br/>
                <h2>Sample Input</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.samInput)}
                </ReactMarkdown>
                <br/>
                <h2>Sample Output</h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.samOutput)}
                </ReactMarkdown>
                <br/>
                <h2>Testcase</h2>
                <div className="testcase-container">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {String(questionData?.testcase)}
                </ReactMarkdown>
                </div>
                <button 
                className="copy-btn"
                onClick={() => CopyToClipboard(questionData?.testcase)}>
                    Copy Testcase
                </button>
                <div className="answer-container">
                    <h2>Answer</h2>
                    <div className="answer-info">
                        <div id="attempts-left">
                            Attempts left to get an attack:{" "} 
                {questionData?.difficulty && attemptsState !== undefined? 
                                questionData.difficulty - attemptsState > 0 ? 
                                    questionData.difficulty - attemptsState: 0 : null}
                        </div>

                    </div>

                    <textarea className="answer-textarea"
                    onChange={e => {setUserAnswer(e.target.value)}}
                    ></textarea>
                    <button
                        onClick={() => {
                            handleAnswerSubmit()
                        }}
                        className="answer-button"
                    >
                        Submit
                    </button>
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
