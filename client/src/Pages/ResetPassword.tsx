import React, { useState } from "react"
import { useHistory, useParams } from "react-router"
import "../styles/LoginPage.css"

const ResetPassword : React.FC = () => {

    const {token} : any = useParams()
    const [status, handleStatus] = useState<string | null>(null)
    const [confirmPassword, handleConfirmPassword] = useState<string>("");
    const [password, handlePassword] = useState<string>("");
    const history = useHistory()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if(confirmPassword !== password){
            handleStatus("Passwords do not match")
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
                document.getElementById("login-status")?.setAttribute("style", "color: #fff");
                handleStatus("Password reset successful")
                setTimeout(() => {
                    history.push("/login")
                }, 2500)
            }
            else{
                handleStatus(data.msg)
            }
        })
    }

    return <div className="login-page">
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
          <input type="submit" value="SUBMIT"/>
        </form>
       <p className="login-status" id="login-status" style={{display: status? "block" : "none"}}>
         {status}
          </p> 
        </div>
    </div>
}

export default ResetPassword