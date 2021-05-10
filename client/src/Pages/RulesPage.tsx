import React, { useContext, useEffect } from "react"
import { Redirect } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { getUser } from "../utils"

const RulesPage : React.FC = ( ) => {

    const auth = useContext(AuthContext)

    useEffect(() => {
        auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : []})
    })

    useEffect(() => {
        if(auth.state.token !== null && auth.state.token !== "x"){
            getUser(auth)
        }
    }, [auth.state.token])

    if(auth.state.token !== null && auth.state.token === "x"){
        return <Redirect to="/login" />
    }

    return <div>
        Rules go here
    </div>
}

export default RulesPage