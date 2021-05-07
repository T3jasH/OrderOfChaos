
export interface Question {
    id: number
    level : number
    isLocked : boolean
    isSolved : boolean
    cost : number
    tags : string[]        
}

enum  ActionTypes {
    GET_QUESTIONS = "GET_QUESTIONS",
    SET_UNLOCKED = "SET_UNLOCKED",
    SET_SOLVED = "SET_SOLVED"
}

export interface QuestionAction {
    type: ActionTypes
    payload: any
}

export const questionReducer = (state : Question[], action : QuestionAction) => {
    switch (action.type){
        case "GET_QUESTIONS":
            return action.payload
        case "SET_UNLOCKED": {
            return state[action.payload.id].isLocked = false
        }
        case "SET_SOLVED": {
            return state[action.payload.id].isSolved = true
        }
        default:
            return state
    }
}
 
