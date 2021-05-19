import React from "react"
import "../styles/QuestionInfo.css"
import { IQuestion } from "../Pages/QuestionPage"

interface props {
    questionData: IQuestion | null
    attacksAvailable: Number | null
}
const QuestionInfo = ({ questionData, attacksAvailable }: props) => {
    const getDifficulty = (diff: any) => {
        if (diff === 1) return "Easy"
        if (diff === 2) return "Medium"
        if (diff === 3) return "Hard"
        return null
    }
    return (
        <div className="question-info">
            <div>
                <span className="question-info-label">Difficulty: </span>
                <span
                    style={{
                        color:
                            questionData?.difficulty === 1
                                ? "#7DFD7A"
                                : questionData?.difficulty === 2
                                ? "#FBFF35"
                                : "#FF4A4A",
                        fontWeight: 500,
                    }}
                >
                    {getDifficulty(questionData?.difficulty)}
                </span>
            </div>
            <div>
                <span className="question-info-label">Points: </span>
                <span className="question-info-purple">
                    {questionData?.points}
                </span>
            </div>
            <div>
                <span className="question-info-label">Penalty: </span>
                <span className="question-info-purple">
                    {questionData?.penalty}
                </span>
            </div>
            <div>
                <span className="question-info-label">Submissions: </span>
                <span className="question-info-purple">
                    {questionData?.solved}
                </span>
            </div>
            <div>
                <span className="question-info-label">Attacks Available: </span>
                <span className="question-info-purple">{attacksAvailable}</span>
            </div>
        </div>
    )
}

export default QuestionInfo

{
    /* <p className="question-points"

style={{color : question.difficulty===1 ?
    
    "#7DFD7A" : question.difficulty===2 ?

"#FBFF35" : "#FF4A4A" }} > */
}
