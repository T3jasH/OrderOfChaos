import React, { useContext, useEffect, useState } from "react"
import "../styles/LoginPage.css"

import { Redirect, useHistory } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"

declare global {
    interface Window {
        grecaptcha: any
    }
}

const RegisterPage: React.FC = () => {
    const [email, handleEmail] = useState<string>("")
    const [username, handleUsername] = useState<string>("")
    const [regno, handleRegno] = useState<string>("")
    const [password, handlePassword] = useState<string>("")
    const [confirmPassword, handleConfirmPassword] = useState<string>("")
    const [name, handleName] = useState<string>("")
    const [phoneNo, handlePhoneNo] = useState<string>("")
    const history = useHistory()
    const [btnDisable, setBtnDisable] = useState<boolean>(false)
    const [regMsg, setRegMsg] = useState<null | string>(null)
    const auth = useContext(AuthContext)
    const SITE_KEY = "6LcIPhIbAAAAAG4Rn8C5IkFd5pkCTsjuHBkHG2iV"

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const loadScriptByURL = (id: any, url: any, callback: any) => {
            const isScriptExist = document.getElementById(id)

            if (!isScriptExist) {
                var script = document.createElement("script")
                script.type = "text/javascript"
                script.src = url
                script.id = id
                script.onload = function () {
                    if (callback) callback()
                }
                document.body.appendChild(script)
            }

            if (isScriptExist && callback) callback()
        }

        // load the script by passing the URL
        loadScriptByURL(
            "recaptcha-key",
            `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`,
            function () {}
        )
    }, [])
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (btnDisable === true) return
        // Frontend validation
        if (password !== confirmPassword) {
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
        if (!(regno.trim().length === 9 || regno === "000")) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Invalid registration No.", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        if (phoneNo.trim().length < 10) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Invalid phone No.", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        if (
            password.length === 0 ||
            confirmPassword.length === 0 ||
            username.trim().length === 0 ||
            name.trim().length === 0 ||
            email.trim().length === 0
        ) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Please fill all fields", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3000)
            return
        }
        if (password.match(/\s/g)) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: {
                    msg: "Password cannot contain spaces",
                    type: "fail",
                },
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
        setTimeout(() => setBtnDisable(false), 2500)

        window.grecaptcha.ready(() => {
            window.grecaptcha
                .execute(SITE_KEY, { action: "submit" })
                .then((token: any) => {
                    const body = {
                        email: email.trim(),
                        name: name.trim(),
                        regno: regno.trim(),
                        password: password,
                        username: username.trim(),
                        college: "MIT",
                        phoneNo: phoneNo.trim(),
                        captchaToken: token,
                    }

                    submitData(body)
                })
        })

        const submitData = (body: any) => {
            fetch("/api/users", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .catch((err) => console.log(err))
                .then((data) => {
                    // console.log(data)
                    if (data.success) {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
                        })
                        history.push("/login")
                    } else if (data.errors) {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.error[0].msg, type: "fail" },
                        })
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
    }

    // console.log(auth.state.token)

    if (auth.state.token !== null && auth.state.token !== "x") {
        return <Redirect to="/" />
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 style={{ marginTop: 25, textAlign: "center" }}>
                    <img src="/Logo.svg" alt="" className="logo-login" /> ORDER
                    OF CHAOS
                </h2>
                <h3 style={{ marginTop: 2 }}>REGISTER</h3>
                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="login-form register-form"
                >
                    <input
                        type="text"
                        placeholder="USERNAME"
                        name="username"
                        onChange={(e) => handleUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="FULL NAME"
                        name="name"
                        onChange={(e) => handleName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="EMAIL"
                        name="email"
                        onChange={(e) => handleEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        onChange={(e) => handlePassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="CONFIRM PASSWORD"
                        onChange={(e) => handleConfirmPassword(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="PHONE NO"
                        name="phoneNo"
                        onChange={(e) => handlePhoneNo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="REGISTRATION NO"
                        name="regno"
                        onChange={(e) => handleRegno(e.target.value)}
                        onFocus={() => setRegMsg("Enter 000 if not from MIT")}
                        onBlur={() => setRegMsg(null)}
                    />
                    {<span id="regno-msg">{regMsg}</span>}
                    <input
                        type="submit"
                        value="REGISTER"
                        className={`register-submit-btn ${
                            btnDisable === true ? "disable-button" : ""
                        }`}
                        style={{ marginTop: "2.2rem" }}
                    />
                </form>

                <button
                    className="btn-login"
                    style={{ marginTop: "2.5vh", marginBottom: "2.5vh" }}
                    onClick={() => {
                        history.push("/login")
                    }}
                >
                    ALREADY HAVE AN ACCOUNT?
                </button>
            </div>
        </div>
    )
}

export default RegisterPage
