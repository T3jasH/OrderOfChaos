import React, { useEffect, useContext } from "react"
import { useParams, useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/LoginPage.css"

const MailVerificationPage: React.FC = () => {
    const { token }: any = useParams()
    const auth = useContext(AuthContext)
    const history = useHistory()

    useEffect(() => {
        if (token)
            fetch(`/api/users/confirmation/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .catch((err) => console.log(err))
                .then((data) => {
                    if (data.success) {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
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
                    history.push("/login")
                })
        // eslint-disable-next-line
    }, [token])

    return <div className="login-page"></div>
}

export default MailVerificationPage
