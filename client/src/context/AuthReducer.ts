export interface Auth {
    token: string | null
    isAdmin: boolean
    isStarted: boolean | null
    isEnded: boolean | null
    id: string
    username: string
    authAlertMessage?: string | null
    alertMessageType?: string | null
}

export enum AuthActionTypes {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    GET_TOKEN = "GET_TOKEN",
    GET_AUTH = "GET_AUTH",
    NOT_STARTED = "NOT_STARTED",
    SET_MESSAGE = "SET_MESSAGE",
    CLEAR_MESSAGE = "CLEAR_MESSAGE",
}

export interface AuthAction {
    type: AuthActionTypes
    payload: any
}

export const authReducer = (state: Auth, action: AuthAction) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("iecseOrderOfChaosUser", action.payload.token)
            return {
                ...state,
                token: action.payload.token,
                isStarted: action.payload.isStarted,
            }
        case "LOGOUT":
            localStorage.removeItem("iecseOrderOfChaosUser")
            return {
                ...state,
                token: "x",
            }
        case "GET_TOKEN":
            let token = localStorage.getItem("iecseOrderOfChaosUser")
            if (token === null || token.length === 0) {
                token = "x"
            }
            return {
                ...state,
                token: token,
            }
        case "GET_AUTH":
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
                isStarted: action.payload.isStarted,
                isEnded: action.payload.isEnded,
                id: action.payload.id,
                username: action.payload.username,
            }
        case "SET_MESSAGE":
            return {
                ...state,
                authAlertMessage: action.payload.msg,
                alertMessageType: action.payload.type,
            }
        case "CLEAR_MESSAGE":
            return {
                ...state,
                authAlertMessage: null,
                messageType: null,
            }
        case "NOT_STARTED":
            return {
                ...state,
                isStarted: false,
            }
        default:
            return state
    }
}
