import React, { useContext, useState } from "react"
import { useHistory, useParams } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/LoginPage.css"

const ResetPassword: React.FC = () => {
    const { token }: any = useParams()
    const [confirmPassword, handleConfirmPassword] = useState<string>("")
    const [password, handlePassword] = useState<string>("")
    const [btnDisable, setBtnDisable] = useState<boolean>(false)
    const auth = useContext(AuthContext)
    const history = useHistory()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(btnDisable === true){
            return;
        }
        if (confirmPassword !== password) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Passwords do not match", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        if(password.match(/\s/g)){
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Password cannot contain spaces", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        setBtnDisable(true)
        setTimeout(() => {
            setBtnDisable(false)
        }, 2000)
        fetch(`/api/users/resetpassword/${token}`, {
            method: "POST",
            body: JSON.stringify({ password: password }),
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((resp) => resp.json())
            .catch((err) => console.log(err))
            .then((data) => {
                if (data.success) {
                    auth.dispatch({
                        type: AuthActionTypes.SET_MESSAGE,
                        payload: { msg: data.msg, type: "success" },
                    })
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3000)
                    history.push("/login")
                } else {
                    auth.dispatch({
                        type: AuthActionTypes.SET_MESSAGE,
                        payload: { msg: data.msg, type: "fail" },
                    })
                }
                setTimeout(() => {
                    auth.dispatch({
                        type: AuthActionTypes.CLEAR_MESSAGE,
                        payload: {},
                    })
                }, 3000)
            })
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>ORDER OF CHAOS</h2>
                <h3>RESET PASSWORD</h3>
                <form onSubmit={(e) => handleSubmit(e)} className="login-form">
                    <input
                        style={{ marginTop: "4rem" }}
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
                    <input
                        type="submit"
                        className={`login-submit-btn ${btnDisable === true ? "disable-button" : ""}`}
                        value="SUBMIT"
                    />
                </form>
            </div>
        </div>
    )
}

export default ResetPassword
