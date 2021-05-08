export interface Auth {
    token: string | null
    isAdmin : boolean
    isStarted : boolean
}

export enum AuthActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    GET_TOKEN = "GET_TOKEN",
    GET_AUTH = "GET_AUTH"
}

export interface AuthAction {
    type: AuthActionTypes
    payload: any 
}

export const authReducer = (state : Auth, action : AuthAction) => {
    switch(action.type){
        case "LOGIN":
            localStorage.setItem("iecseOrderOfChaosUser", action.payload.token)
            return {
                token : action.payload.token,
                isAdmin : action.payload.isAdmin,
                isStarted : true
            }
        case "LOGOUT":
            localStorage.removeItem("iecseOrderOfChaosUser");
            return {
                ...state, 
                token : null
            }
        case "GET_TOKEN" :
            let token = localStorage.getItem("iecseOrderOfChaosUser")
            if(token === null){
                token = "x";
            }
            return {
                ...state,
                token : token
            }
        case "GET_AUTH": 
            return {
                token : localStorage.getItem("iecseOrderOfChaos"),
                isAdmin : action.payload.isAdmin,
                isStarted : action.payload.isStarted
            }
        default :
        return state
    }
} 