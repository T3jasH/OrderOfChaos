import {Auth, authReducer, UserAction} from "./AuthReducer"
import React from "react"

const authDefaultState : Auth = {
    token: null,
    score: 0,
    attacksLeft : 0,
    isAdmin : false,
    isStarted : true
}

export interface AuthContextModel {
    state: Auth
    dispatch: React.Dispatch<UserAction>
}

export const AuthContext = React.createContext<AuthContextModel>({} as AuthContextModel)

const AuthProvider : React.FC = ({children}) => {

    const [state, dispatch] = React.useReducer(authReducer, authDefaultState) 

    return <AuthContext.Provider value={{state, dispatch}}>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider;
