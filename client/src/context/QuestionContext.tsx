import { Question, QuestionAction, questionReducer } from "./QuestionReducer"
import React from "react"

const questionDefaultState: Question[] = [
    // {
    //     id: 0,
    //     level : 1,
    //     isLocked : true,
    //     isSolved : false,
    //     cost : 20,
    //     tags : [""]
    // }
]

export interface QuestionContextModel {
    state: Question[]
    dispatch: React.Dispatch<QuestionAction>
}

export const QuestionContext = React.createContext<QuestionContextModel>(
    {} as QuestionContextModel
)

const QuestionListProvider: React.FC = ({ children }) => {
    const [state, dispatch] = React.useReducer(
        questionReducer,
        questionDefaultState
    )

    return (
        <QuestionContext.Provider value={{ state, dispatch }}>
            {children}
        </QuestionContext.Provider>
    )
}

export default QuestionListProvider
