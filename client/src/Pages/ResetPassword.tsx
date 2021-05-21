import React, { useContext, useState } from "react"
import { useHistory, useParams } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/LoginPage.css"

const ResetPassword : React.FC = () => {

    const {token} : any = useParams()
    const [status, handleStatus] = useState<string | null>(null)
    const [confirmPassword, handleConfirmPassword] = useState<string>("");
    const [password, handlePassword] = useState<string>("");
    const auth = useContext(AuthContext)
    const history = useHistory()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(confirmPassword !== password){
            handleStatus("Passwords do not match")
            setTimeout(() => handleStatus(null), 5000)
            return;
        }
        fetch(`/api/users/resetpassword/${token}`, {
            method : "POST",
            body: JSON.stringify({password : password}),
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(resp => resp.json())
        .catch(err => console.log(err))
        .then(data => {
            if(data.success){
                auth.dispatch({type: AuthActionTypes.SET_MESSAGE, payload: {msg : data.msg}})
                history.push("/login")
            }
            else{
                handleStatus(data.msg)
                setTimeout(() => handleStatus(null), 5000)
            }
        })
    }

    return <div className="login-page">
        <div className="status-container">
            <p 
            className="login-status"
            style={{display : status === null ? "none" : "flex"}}>
                {status}
            </p>
      </div>
        <div className="login-container">
        <h2>ORDER OF CHAOS</h2>
         <h3>
           RESET PASSWORD
         </h3>
         <form onSubmit={e => handleSubmit(e)} className="login-form">
          <input
            style={{marginTop : "4rem"}}
            type="password"
            placeholder="PASSWORD"
            name="email"
            onChange={(e) => handlePassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="CONFIRM PASSWORD"
            onChange={(e) => handleConfirmPassword(e.target.value)}
          />
          <input type="submit" className="login-submit-btn" value="SUBMIT"/>
        </form>
        </div>
    </div>
}

export default ResetPassword