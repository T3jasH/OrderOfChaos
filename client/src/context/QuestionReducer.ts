export interface Question {
    name: string
    quesId: number
    points: number
    isLocked: boolean
    isSolved: boolean
    unlockCost: number
    penalty: number
    attempts: number
    solved: number
    difficulty: Number
}

export enum QuestionActionTypes {
    GET_QUESTIONS = "GET_QUESTIONS",
    SET_UNLOCKED = "SET_UNLOCKED",
    SET_SOLVED = "SET_SOLVED",
}

export interface QuestionAction {
    type: QuestionActionTypes
    payload: any
}

export const questionReducer = (state: Question[], action: QuestionAction) => {
    switch (action.type) {
        case "GET_QUESTIONS":
            // console.log("PAYLOAD ", action.payload)
            return action.payload
        case "SET_UNLOCKED": {
            return state.map((question) => {
                if (question.quesId === action.payload.id) {
                    question.isLocked = false
                }
                return question
            })
        }
        case "SET_SOLVED": {
            return state.map((question) => {
                if (question.quesId === action.payload.id) {
                    question.isSolved = true
                }
                return question
            })
        }
        default:
            return state
    }
}
