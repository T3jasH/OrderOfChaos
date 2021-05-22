import React, { useState, useContext, useEffect } from "react"
import "../styles/LoginPage.css"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { Redirect, useHistory } from "react-router-dom"

const LoginPage: React.FC = () => {
    const [email, handleEmail] = useState<string>("")
    const [password, handlePassword] = useState<string>("")
    const [loginText, setLoginText] = useState<string>("LOGIN")
    const [loginBtnText, setLoginBtnText] = useState<string>("LOGIN")
    const [pageType, setPageType] = useState<string>("login")
    const auth = useContext(AuthContext)
    const history = useHistory()

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
        // eslint-disable-next-line
    }, [])

    if (auth.state.token !== "x" && auth.state.token !== null) {
        return <Redirect to="/" />
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (pageType === "login") {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, password: password }),
            })

            const data = await response.json()
            console.log(data)
            if (data.success) {
                auth.dispatch({
                    type: AuthActionTypes.LOGIN,
                    payload: { token: data.data.token },
                })
                history.push("/")
            } else if (data.errors) {
                auth.dispatch({
                    type: AuthActionTypes.SET_MESSAGE,
                    payload: { msg: data.errors[0].msg, type : "fail" },
                })
            } else {
                auth.dispatch({
                    type: AuthActionTypes.SET_MESSAGE,
                    payload: { msg: data.msg, type : "fail" },
                })
            }
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
        } else if (pageType === "forgotPassword") {
            const response = await fetch("/api/users/forgotpassword", {
                method: "POST",
                body: JSON.stringify({ email: email }),
                headers: {
                    "Content-type": "application/json",
                },
            })
            const data = await response.json()
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: data.msg },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.SET_MESSAGE,
                    payload: { msg: null },
                })
            }, 3000)
        } else {
            const response = await fetch("/api/users/resendEmail", {
                method: "POST",
                body: JSON.stringify({ email: email }),
                headers: {
                    "Content-type": "application/json",
                },
            })
            const data = await response.json()
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: data.msg, type : "default" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3500)
        }
    }

    const handleForgotPassword = () => {
        setPageType("forgotPassword")
        document
            .getElementById("password")
            ?.setAttribute("style", "display : none;")
        document
            .getElementById("login-text")
            ?.setAttribute("style", "letter-spacing : 0.2em;")
        var btns = document.getElementsByClassName("btn-login")
        for (var i = 0; i < btns.length - 1; i++) {
            btns[i]?.setAttribute("style", "display: none")
        }
        btns[btns.length - 1].setAttribute(
            "style",
            "display: block;margin-top: 5vh"
        )
        setLoginBtnText("SUBMIT")
        setLoginText("FORGOT PASSWORD")
    }

    const handleVerification = () => {
        document
            .getElementById("password")
            ?.setAttribute("style", "display : none;")
        document
            .getElementById("login-text")
            ?.setAttribute("style", "letter-spacing : 0.2em;")
        var btns = document.getElementsByClassName("btn-login")
        for (var i = 0; i < btns.length - 1; i++) {
            btns[i]?.setAttribute("style", "display: none")
        }
        btns[btns.length - 1].setAttribute(
            "style",
            "display: block;margin-top: 5vh"
        )
        setPageType("verification")
        setLoginBtnText("SUBMIT")
        setLoginText("RESEND VERIFICATION EMAIL")
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>ORDER OF CHAOS</h2>
                <h3 id="login-text">{loginText}</h3>
                <form onSubmit={(e) => handleSubmit(e)} className="login-form">
                    <input
                        type="text"
                        placeholder="EMAIL"
                        name="email"
                        onChange={(e) => handleEmail(e.target.value)}
                    />
                    <input
                        id="password"
                        type="password"
                        placeholder="PASSWORD"
                        onChange={(e) => handlePassword(e.target.value)}
                    />
                    <input
                        type="submit"
                        value={loginBtnText}
                        className="login-submit-btn"
                    />
                </form>
                <button
                    id="forgot-password"
                    className="btn-login"
                    style={{ marginTop: "7vh" }}
                    onClick={handleForgotPassword}
                >
                    FORGOT PASSWORD?
                </button>
                <button
                    id="verification"
                    className="btn-login"
                    onClick={handleVerification}
                >
                    VERIFICATION NOT SENT?
                </button>
                <button
                    className="btn-login"
                    onClick={(e) => history.push("/register")}
                >
                    SIGN UP
                </button>
                <button
                    className="btn-login"
                    onClick={(e) => {
                        history.push("/rules")
                    }}
                >
                    RULES
                </button>
                <button
                    className="btn-login"
                    onClick={(e) => {
                        window.location.reload()
                    }}
                    style={{ display: "none", marginTop: "7vh" }}
                >
                    BACK TO LOGIN
                </button>
            </div>
        </div>
    )
}

export default LoginPage
