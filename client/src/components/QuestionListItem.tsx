import React, {useContext} from "react"
import { Question, QuestionActionTypes } from "../context/QuestionReducer"
import {AuthContext} from "../context/AuthContext"
import "../styles/QuestionsListItem.css"
import { QuestionContext } from "../context/QuestionContext"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { useHistory } from "react-router"

interface props {
    question: Question 
}


const QuestionListItem : React.FC<props>  = ({question}) => {

    const bgcolor = question.isLocked ? "#996b91" : question.isSolved? "#42eb6c" : question.points === 100 ? "yellow" : question.points === 200 ? "#03e3fc" : "#f5404c";
    const difficulty = question.points === 100 ? "easy" : question.points === 200 ? "medium" : "hard";
    const token = useContext(AuthContext).state.token
    const questions = useContext(QuestionContext)
    const player = useContext(PlayerContext)
    const history = useHistory()

    const unlockQuestion = () => {
        if(token)
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
                console.log("RECEIVED")
                questions.dispatch({type : QuestionActionTypes.SET_UNLOCKED, payload : {id : question.quesId}})
                player.dispatch({type : PlayerActionTypes.UPDATE_SCORE, payload : {score : player.state.score - question.unlockCost}})
            }
        })
    }

    const handleClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log("called")
        if(question.isLocked){
            return;
        }
        
        history.push(`question/${question.quesId}`)
    }

    return <div className="question" style={{  
        backgroundColor : bgcolor,
        opacity : question.isLocked? 0.85 : 1,
        cursor : question.isLocked ? "default" : "pointer"
        }}
        onClick={e => handleClick(e)}
        >
        <p className="question-name">
            {question.name}
        </p>
        <button onClick={unlockQuestion}  className="unlock-btn" style={{
            visibility : question.isLocked && question.unlockCost <= player.state.score ? "visible" : "hidden"
            }} >
            Unlock
        </button>
        <p className="points">
            Points : {question.points}
        </p>
        <p className="cost" style={{visibility : question.isLocked ? "visible" : "hidden"}}>
            Unlock cost : {question.unlockCost}
        </p>
        <p className="difficulty">
            {difficulty}
        </p>
    </div>
}

export default QuestionListItem;