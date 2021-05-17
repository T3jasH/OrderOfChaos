import React from "react"
import "../styles/QuestionInfo.css"

const QuestionInfo = () => {
    return (
        <div className="question-info">
            <div>{`Difficulty: Easy`}</div>
            <div>{`Points: 100`}</div>
            <div>{`Penalty: 5`}</div>
            <div>{`Submissions: 1`}</div>
            <div>{`Attacks Available: 1`}</div>
        </div>
    )
}

export default QuestionInfo
