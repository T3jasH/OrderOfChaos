
export interface Question {
    name : string
    quesId: number
    points : number
    isLocked : boolean
    isSolved : boolean
    tags : string[]    
    unlockCost : number
    penalty : number
    atttempts : number    
}

export enum  QuestionActionTypes {
    GET_QUESTIONS = "GET_QUESTIONS",
    SET_UNLOCKED = "SET_UNLOCKED",
    SET_SOLVED = "SET_SOLVED"
}

export interface QuestionAction {
    type: QuestionActionTypes
    payload: any
}

export const questionReducer = (state : Question[], action : QuestionAction) => {
    switch (action.type){
        case "GET_QUESTIONS":
            return action.payload
        case "SET_UNLOCKED": {
            state[action.payload.id].isLocked = false
            return state
        }
        case "SET_SOLVED": {
            return state[action.payload.id].isSolved = true
        }
        default:
            return state
    }
}
 
