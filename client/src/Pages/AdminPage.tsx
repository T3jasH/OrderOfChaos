import React, { useContext, useEffect } from "react"
import { Redirect } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/AdminPage.css"

const AdminPage : React.FC = () => {

    const auth = useContext(AuthContext)
    useEffect(() => {
        if(auth.state.token === null){
            auth.dispatch({type : AuthActionTypes.GET_AUTH, payload : []})
        }
    }, [])

    useEffect(()=>{
        if(auth.state.token !== null) {
            fetch("/api/user", {
                method : "GET",
                headers : {
                    "Content-type" : "application/json",
                    "x-auth-token" : auth.state.token
                }
            })
            .then(resp => {
                if(resp.status === 401){
                    auth.dispatch({type : AuthActionTypes.LOGOUT, payload : []})
                }
                return resp.json()
            })
            .catch(err => console.log(err))
            .then(data => {
                if(data.success)
                auth.dispatch({type : AuthActionTypes.GET_AUTH, payload : {
                    isAdmin : data.data.user.isAdmin,
                    isStarted : true
                }})
                else{
                    console.log(data.msg)
                }
            })
        }
    }, [auth.state.token])

    if(auth.state.token === "x"){
        return <Redirect to="/login" />
    }

    if(auth.state.token !== null && auth.state.token !== "x" && !auth.state.isAdmin){
        return <Redirect to = "/"/>
    }

    return <div className="admin">
        <h3>Name</h3>
        <textarea className="short" name="name" />
        <h3>Points</h3>
        <textarea className="short" name="points" />
        <h3>Penalty</h3>
        <textarea className="short" name="penalty" />
        <h3>Tags</h3>
        <textarea className="short" name="tags" />
        <h3>Statement</h3>
        <textarea className="long" name="statement" />

    </div>
}

export default AdminPage;