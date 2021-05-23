import React, {useContext, useEffect, useState} from "react"
import { Question, QuestionActionTypes } from "../context/QuestionReducer"
import {AuthContext} from "../context/AuthContext"
import "../styles/QuestionsListItem.css"
import { QuestionContext } from "../context/QuestionContext"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { useHistory } from "react-router"
import { AuthActionTypes } from "../context/AuthReducer"

interface props {
    question: Question 
    index: number
}
  
const QuestionListItem : React.FC<props>  = ({question, index}) => {

    const token = useContext(AuthContext).state.token
    const questions = useContext(QuestionContext)
    const player = useContext(PlayerContext)
    const auth = useContext(AuthContext)
    const history = useHistory()
    const [lockStatus, setLockStatus] = useState<string>(""); 

    useEffect(()=> {
        if(question?.name?.length){
            setLockStatus(question.isLocked? player.state.score < question.unlockCost? `Locked` : `Unlock: ${question.unlockCost}pts` : 
            question.isSolved? "Solved" : "Unlocked")
        }
        console.log(question.isSolved, question.isLocked)
        // eslint-disable-next-line
    }, [question.name, question.isSolved, question.isLocked])

    const unlockQuestion = () => {
        if(token && player.state.score >= question.unlockCost && question.isLocked)
        fetch(`/api/question/locked/${question.quesId}`, {
            method : "GET",
            headers : {
                "Content-type" : "application/json",
                "x-auth-token" : token
            }
        })
        .then(resp => resp.json())
        .catch(err => console.log(err))
        .then(data => {
            console.log(data)
            if(data.success){
                questions.dispatch({type : QuestionActionTypes.SET_UNLOCKED, payload : {id : question.quesId}})
                player.dispatch({type : PlayerActionTypes.UPDATE_SCORE, payload : {score : player.state.score - question.unlockCost}})
            }
        })
    }

    const handleClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if(question.isLocked){
            return;
        }
        history.push(`question/${question.quesId}`)
    }

    return <div className="question" 
        style={{
            cursor: !question.isLocked ? "pointer" : "default",
            background : question.isSolved ? "#6D30ED" : "inherit"
        }}

        onClick={e => handleClick(e)}
        >
        <p className="index">
            {index + 1}
        </p>
        <p className="question-name">
            {question.name}
        </p>
        <button className="question-lock" 
        style={{
            background : question.isLocked? player.state.score < question.unlockCost ? "inherit" : "#6D30ED" : "inherit",
            cursor : question.isLocked ? player.state.score < question.unlockCost ? "default" : "pointer" : "default" ,
            border: question.isLocked && player.state.score < question.unlockCost ? "1px solid white" : "none"
        }}
        onClick={unlockQuestion}
        onMouseEnter={
            () => {
               if(question.isLocked && player.state.score < question.unlockCost){
                   setLockStatus(`${question.unlockCost}pts`)
               }
            }
        }
        onMouseLeave = {() => {
            if(question.isLocked && player.state.score < question.unlockCost){
                setLockStatus("Locked")
            }
         }}
        >
            {
                lockStatus
            }
        </button>
        <p className="question-points" style={{color : question.difficulty===1 ? "#7DFD7A" : question.difficulty===2 ? "#FBFF35" : "#FF4A4A" }} >
            {`${question.points} pts`}
        </p>
        <p className="question-solved"
        style={{color : question.isSolved ? "#FFF " : "#9C9D8E "}}
        >
            <i className="fas fa-user"></i>{` x ${question.solved}`}
        </p>
    </div>
}

export default QuestionListItem;