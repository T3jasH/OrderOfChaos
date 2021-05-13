import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/AdminPage.css"
import { getUser } from "../utils"

const AdminPage : React.FC = () => {

    const [statement, handleStatement] = useState<string>("")
    const [name, handleName] = useState<string>("")
    const [sampleInput, handleSampleInput] = useState<string>("")
    const [sampleOutput, handleSampleOutput] = useState<string>("")
    const [tcInput, handleTcInput] = useState<string>("")
    const [tcOutput, handleTcOuput] = useState<string>("")
    const [constraints, handleConstraints] = useState<string>("")
    const [difficulty, handleDifficulty] = useState<number | null>(null)
    const [quesId, handleQuesId] = useState<number | null>(null)
    const [errorMsg, setErrorMsg] = useState<null | string>(null)

    const auth = useContext(AuthContext)
    useEffect(() => {
        if(auth.state.token === null){
            auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : []})
        }
    }, [])

    useEffect(()=>{
        getUser(auth)     
    }, [auth.state.token])

    const handleSubmit = async () => {
        console.log("Submit")
        if(auth.state.token)
        fetch("/api/admin/", {
            method : "POST",
            headers : {
                "Content-type" : "application/json",
                "x-auth-token" : auth.state.token
            },
            body : 
                JSON.stringify(
                    {
                        quesId: quesId,
                        name: name,
                        tags: "",
                        statement: statement,
                        constraints: constraints,
                        inpFormat: "  ",
                        outFormat: "  ",
                        samInput: sampleInput,
                        samOutput: sampleOutput,
                        testcase: tcInput,
                        answer: tcOutput,
                        difficulty: difficulty
                    }
                )
        })
        .then(resp => {
            if(resp.status === 401){
                auth.dispatch({type : AuthActionTypes.LOGOUT, payload : []})
            }    
            return resp.json()
        })
        .catch(err => console.log(err))
        .then(data => {
            console.log(data)
            if(data.success){
                setErrorMsg(data.msg)
            }
            else if(data.errors){
                setErrorMsg(data.errors[0])
            }
            else{
                setErrorMsg("DB error")
            }
        })
    }    

    if(auth.state.loading){
        return <div>insert loading animation here</div>
    }

    if(auth.state.token === "x"){
        return <Redirect to="/login" />
    }

    //CHECK ADMIN OR NOT
    if(auth.state.token !== null && auth.state.token !== "x" && !auth.state.isAdmin){
        return <Redirect to="/" />
    }

    return <div className="admin">
        <h3>Name</h3>
        <textarea className="short" name="name" onChange={e => handleName(e.target.value)} />
        <h3>Question Id</h3>
        <textarea className="short" name="quesId" onChange={e => handleQuesId(e.target.value as unknown as number)} />
        <h3>Difficulty</h3>
        <textarea className="short" name="penalty" onChange={e => handleDifficulty(e.target.value as unknown as number)} />
        <h3>Statement</h3>
        <textarea className="long" name="statement" onChange={e => handleStatement(e.target.value)} />
        <h3>Constraints</h3>
        <textarea className="long" name="constraints" onChange={e => handleConstraints(e.target.value)} />
        <h3>Sample Input</h3>
        <textarea className="long" name="sample-input" onChange={e => handleSampleInput(e.target.value)} />
        <h3>Sample Output</h3>
        <textarea className="long" name="sample-output" onChange={e => handleSampleOutput(e.target.value)} />
        <h3>Testcase Input</h3>
        <textarea className="long" name="tc-input" onChange={e => handleTcInput(e.target.value)} />
        <h3>Testcase Output</h3>
        <textarea className="long" name="tc-output" onChange={e => handleTcOuput(e.target.value)} />
        <br/>
        <button onClick={handleSubmit}>
            <h3>Submit</h3>
        </button>
        {   errorMsg?
            <b> {errorMsg} </b>
            :
            null
        }
    </div>
}

export default AdminPage;