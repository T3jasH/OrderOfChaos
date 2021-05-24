import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/AdminPage.css"
import { getUser } from "../utils"

const AdminPage: React.FC = () => {
    const [statement, handleStatement] = useState<string>("")
    const [name, handleName] = useState<string>("")
    const [tcInput, handleTcInput] = useState<string>("")
    const [tcOutput, handleTcOuput] = useState<string>("")
    const [difficulty, handleDifficulty] = useState<number | null>(null)
    const [quesId, handleQuesId] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const auth = useContext(AuthContext)
    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        getUser(auth).then((data) => {
            if (data.success) {
                setLoading(false)
            }
        })
        // eslint-disable-next-line
    }, [auth.state.token])

    const handleSubmit = async () => {
        console.log("Submit")
        if (auth.state.token)
            fetch("/api/admin/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": auth.state.token,
                },
                body: JSON.stringify({
                    quesId: quesId,
                    name: name,
                    tags: "",
                    statement: statement,
                    constraints: " ",
                    inpFormat: "  ",
                    outFormat: "  ",
                    samInput: " ",
                    samOutput: " ",
                    testcase: tcInput,
                    answer: tcOutput,
                    difficulty: difficulty,
                }),
            })
                .then((resp) => {
                    if (resp.status === 401) {
                        auth.dispatch({
                            type: AuthActionTypes.LOGOUT,
                            payload: [],
                        })
                    }
                    return resp.json()
                })
                .catch((err) => console.log(err))
                .then((data) => {
                    console.log(data)
                    if (data.success) {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
                        })
                    } else if (data.errors) {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.errors[0], type: "success" },
                        })
                    } else {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: "Upload failed", type: "success" },
                        })
                    }
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: [],
                        })
                    }, 3000)
                })
    }

    if (loading) {
        return <div>insert loading animation here</div>
    }

    if (auth.state.token === "x") {
        return <Redirect to="/login" />
    }

    if (!auth.state.isStarted) {
        return <Redirect to="/rules" />
    }

    //CHECK ADMIN OR NOT
    if (
        auth.state.token !== null &&
        auth.state.token !== "x" &&
        !auth.state.isAdmin
    ) {
        return <Redirect to="/" />
    }

    return (
        <div className="admin">
            <h3>Name</h3>
            <textarea
                className="short"
                name="name"
                id="name"
                onChange={(e) => handleName(e.target.value)}
            />
            <h3>Question Id</h3>
            <textarea
                className="short"
                name="quesId"
                id="quesId"
                onChange={(e) =>
                    handleQuesId((e.target.value as unknown) as number)
                }
            />
            <h3>Difficulty</h3>
            <textarea
                className="short"
                name="penalty"
                id="penalty"
                onChange={(e) =>
                    handleDifficulty((e.target.value as unknown) as number)
                }
            />
            <h3>Statement</h3>
            <textarea
                className="long"
                name="statement"
                id="statement"
                onChange={(e) => handleStatement(e.target.value)}
            />
            <h3>Testcase Input</h3>
            <textarea
                className="long"
                name="tc-input"
                id="tc-input"
                onChange={(e) => handleTcInput(e.target.value)}
            />
            <h3>Testcase Output</h3>
            <textarea
                className="long"
                name="tc-output"
                id="tc-output"
                onChange={(e) => handleTcOuput(e.target.value)}
            />
            <br />
            <button onClick={handleSubmit} className="admin-submit">
                <h3>Submit</h3>
            </button>
        </div>
    )
}

export default AdminPage
