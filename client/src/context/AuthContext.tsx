import { Auth, authReducer, AuthAction } from "./AuthReducer"
import React from "react"

const authDefaultState: Auth = {
    token: null,
    isAdmin: false,
    isStarted: null,
    isEnded: null,
    id: "",
    username: "",
}

export interface AuthContextModel {
    state: Auth
    dispatch: React.Dispatch<AuthAction>
}

export const AuthContext = React.createContext<AuthContextModel>(
    {} as AuthContextModel
)

const AuthProvider: React.FC = ({ children }) => {
    const [state, dispatch] = React.useReducer(authReducer, authDefaultState)

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
