import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/AdminPage.css"
import { getUser, Loading } from "../utils"

const AdminPage: React.FC = () => {
    const [statement, handleStatement] = useState<string>("")
    const [inpFormat, handleInpFormat] = useState<string>("")
    const [outFormat, handleOutFormat] = useState<string>("")
    const [samInput, handleSamInput] = useState<string>("")
    const [samOutput, handleSamOutput] = useState<string>("")
    const [constraints, handleconstraints] = useState<string>("")
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
                    constraints: constraints,
                    inpFormat: inpFormat,
                    outFormat: outFormat,
                    samInput: samInput,
                    samOutput: samOutput,
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
                            payload: { msg: data.errors[0], type: "fail" },
                        })
                    } else {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: "Upload failed", type: "fail" },
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
        return <Loading/>
    }

    if (auth.state.token === "x") {
        return <Redirect to="/login" />
    }
    
    if (
        auth.state.token !== null &&
        auth.state.token !== "x" &&
        auth.state.isAdmin === false
    ) {
        return <Redirect to="/" />
    }

    return (
        <div className="admin">
            <div className="container">
                <h1 className="heading">POST QUESTION</h1>
                <label>Name</label>
                <textarea
                    className="short"
                    name="name"
                    id="name"
                    onChange={(e) => handleName(e.target.value)}
                />
                <label>Question Id</label>
                <textarea
                    className="short"
                    name="quesId"
                    id="quesId"
                    onChange={(e) =>
                        handleQuesId((e.target.value as unknown) as number)
                    }
                />
                <label>Difficulty</label>
                <textarea
                    className="short"
                    name="penalty"
                    id="penalty"
                    onChange={(e) =>
                        handleDifficulty((e.target.value as unknown) as number)
                    }
                />
                <label>Statement</label>
                <textarea
                    className="long"
                    name="statement"
                    id="statement"
                    onChange={(e) => handleStatement(e.target.value)}
                />
                <label>Constraints</label>
                <textarea
                    className="long"
                    name="constraints"
                    id="constraints"
                    onChange={(e) => handleconstraints(e.target.value)}
                />
                <label>Input Format</label>
                <textarea
                    className="long"
                    name="inpFormat"
                    id="inpFormat"
                    onChange={(e) => handleInpFormat(e.target.value)}
                />
                <label>Output Format</label>
                <textarea
                    className="long"
                    name="outFormat"
                    id="outFormat"
                    onChange={(e) => handleOutFormat(e.target.value)}
                />
                <label>Sample Input</label>
                <textarea
                    className="long"
                    name="samInput"
                    id="samIntput"
                    onChange={(e) => handleSamInput(e.target.value)}
                />
                <label>Sample Output</label>
                <textarea
                    className="long"
                    name="samOutput"
                    id="samOutput"
                    onChange={(e) => handleSamOutput(e.target.value)}
                />

                <label>Testcase Input</label>
                <textarea
                    className="long"
                    name="tc-input"
                    id="tc-input"
                    onChange={(e) => handleTcInput(e.target.value)}
                />
                <label>Testcase Output</label>
                <textarea
                    className="long"
                    name="tc-output"
                    id="tc-output"
                    onChange={(e) => handleTcOuput(e.target.value)}
                />
                <br />
                <button onClick={handleSubmit} className="admin-submit">
                    <label>SUBMIT</label>
                </button>
            </div>
        </div>
    )
}

export default AdminPage
