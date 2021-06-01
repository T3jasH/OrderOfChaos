import React from "react"
import "../styles/QuestionInfo.css"
import { IQuestion } from "../Pages/QuestionPage"

interface props {
    questionData: IQuestion | null
    attemptsToGetAttack: number | null
}
const QuestionInfo = ({ questionData, attemptsToGetAttack }: props) => {
    const getDifficulty = (diff: any) => {
        if (diff === 1) return "Easy"
        if (diff === 2) return "Medium"
        if (diff === 3) return "Hard"
        return null
    }  
    return (
        <div className="question-info">
            <div>
                <span className="question-info-label">Difficulty : </span>
                <span
                    style={{
                        color:
                            questionData?.difficulty === 1
                                ? "#7DFD7A"
                                : questionData?.difficulty === 2
                                ? "#FBFF35"
                                : "#FF4A4A",
                        fontWeight: 600,
                        fontSize: "1.3rem",
                    }}
                >
                    {getDifficulty(questionData?.difficulty)}
                </span>
            </div>
            <div>
                <span className="question-info-label">Points : </span>
                <span className="question-info-purple">
                    {questionData?.points}
                </span>
            </div>
            <div>
                <span className="question-info-label">Penalty : </span>
                <span className="question-info-purple">
                    {questionData?.penalty}
                </span>
            </div>
            <div>
                <span className="question-info-label">Successful Submissions : </span>
                <span className="question-info-purple">
                    {questionData?.solved}
                </span>
            </div>
            {/* <div>
                <span className="question-info-label">
                    Attempts to get attack :{" "}
                </span>
                <span className="question-info-purple">{attemptsToGetAttack}</span>
            </div> */}
        </div>
    )
}

export default QuestionInfo
// eslint-disable-next-line
{
    /* <p className="question-points"

style={{color : question.difficulty===1 ?
    
    "#7DFD7A" : question.difficulty===2 ?

"#FBFF35" : "#FF4A4A" }} > */
}
