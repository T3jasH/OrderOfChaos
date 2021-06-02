import React, { useContext, useEffect, useState } from "react"
import { Question} from "../context/QuestionReducer"
import "../styles/QuestionsListItem.css"
import { PlayerContext } from "../context/PlayerContext"
import { useHistory } from "react-router"


interface props {
    question: Question
    index: number
    unlockQuestion: any 
}

const QuestionListItem: React.FC<props> = ({ question, index, unlockQuestion }) => {
    const player = useContext(PlayerContext)
    const history = useHistory()
    const [lockStatus, setLockStatus] = useState<string>("")

    useEffect(() => {
        if (question?.name?.length) {
            setLockStatus(
                question.isLocked
                    ? player.state.score < question.unlockCost
                        ? `Locked`
                        : `Unlock: ${question.unlockCost}pts`
                    : question.isSolved
                    ? "Solved"
                    : "Unlocked"
            )
        }
        // console.log(question.isSolved, question.isLocked)
        // eslint-disable-next-line
    }, [question.name, question.isSolved, question.isLocked])

    


    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (question.isLocked) {
            return
        }
        history.push(`question/${question.quesId}`)
    }

    var qClass="question";
    if(question.isLocked) qClass="question questionLocked"

    return (
        <div
            className={qClass}
            style={{
                cursor: !question.isLocked ? "pointer" : "default",
                background: question.isSolved ? "#6D30ED" : "inherit",
            }}
            onClick={(e) => handleClick(e)}
        >
            <p className="index">{question.quesId}</p>
            <p className="question-name">{question.name}</p>
            <button
                className="question-lock"
                style={{
                    background: question.isLocked
                        ? player.state.score < question.unlockCost
                            ? "inherit"
                            : "#6D30ED"
                        : "inherit",
                    cursor: question.isLocked
                        ? player.state.score < question.unlockCost
                            ? "default"
                            : "pointer"
                        : "default",
                    border:
                        question.isLocked &&
                        player.state.score < question.unlockCost
                            ? "1px solid white"
                            : "none",
                }}
                onClick={() => {
                    unlockQuestion(question)
                } } 
                onMouseEnter={() => {
                    if (
                        question.isLocked &&
                        player.state.score < question.unlockCost
                    ) {
                        setLockStatus(`${question.unlockCost}pts`)
                    }
                }}
                onMouseLeave={() => {
                    if (
                        question.isLocked &&
                        player.state.score < question.unlockCost
                    ) {
                        setLockStatus("Locked")
                    }
                }}
            >
                {lockStatus}
            </button>
            <p
                className="question-points"
                style={{
                    color:
                        question.difficulty === 1
                            ? "#7DFD7A"
                            : question.difficulty === 2
                            ? "#FBFF35"
                            : "#FF4A4A",
                }}
            >
                {`${question.points} pts`}
            </p>
            <p
                className="question-solved"
                style={{ color: question.isSolved ? "#FFF " : "#9C9D8E " }}
            >
                <i className="fas fa-user"></i>
                {` x ${question.solved}`}
            </p>
        </div>
    )
}

export default QuestionListItem
