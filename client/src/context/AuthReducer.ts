export interface Auth {
    token: string | null
    score: number
    attacksLeft : number
    isAdmin : boolean
    isStarted : boolean
}

export enum AuthActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    CHANGE_SCORE = "CHANGE_SCORE",
    CHANGE_ATTACKS = "CHANGE_ATTACKS",
    GET_USER = "GET_USER",
    GET_TOKEN = "GET_TOKEN"
}

export interface UserAction {
    type: AuthActionTypes
    payload: any 
}

export const authReducer = (state : Auth, action : UserAction) => {
    switch(action.type){
        case "LOGIN":
            localStorage.setItem("iecseOrderOfChaosUser", action.payload.token)
            console.log(action.payload)
            console.log(localStorage.getItem("iecseOrderOfChaosUser"))
            return {
                token : action.payload.token,
                score : 0,
                attacksLeft : 0,
                isAdmin : false,
                isStarted : true
            }
        case "LOGOUT":
            localStorage.removeItem("iecseOrderOfChaosUser");
            return {
                ...state, 
                token : null
            }
        case "CHANGE_SCORE" :
            const newScore = action.payload
            return {
                ...state, 
                score : newScore
            }
        case "CHANGE_ATTACKS" :
            const attacksLeft = action.payload

            return {
                ...state, 
                attacksLeft : attacksLeft
            }
        case "GET_USER" :
            const token = localStorage.getItem("iecseOrderOfChaosUser")
            return {
                token : token,
                score : action.payload.score,
                attacksLeft : action.payload.attacksLeft,
                isAdmin : action.payload.isAdmin,
                isStarted : true
            }
        case "GET_TOKEN" :
            const token2 = localStorage.getItem("iecseOrderOfChaosUser")
            console.log(token2)
            return {
                token : token2,
                score : action.payload.score,
                attacksLeft : action.payload.attacksLeft,
                isAdmin : action.payload.isAdmin,
                isStarted : true
            }
        default :
        return state
    }
} 