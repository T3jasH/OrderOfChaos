import React, { useContext, useEffect, useState } from "react"
import { Redirect } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/AdminPage.css"

const AdminPage : React.FC = () => {

    const [statement, handleStatement] = useState<string>("")
    const [name, handleName] = useState<string>("")
    const [sampleInput, handleSampleInput] = useState<string>("")
    const [sampleOutput, handleSampleOutput] = useState<string>("")
    const [tcInput, handleTcInput] = useState<string>("")
    const [tcOutput, handleTcOuput] = useState<string>("")
    const [constraints, handleConstraints] = useState<string>("")
    const [penalty, handlePenalty] = useState<number | null>(null)
    const [quesId, handleQuesId] = useState<number | null>(null)
    const [points, handlePoints] = useState<number | null>(null)
    const [unlockScore, handleUnlockScore] = useState<number | null>(null)
    const [errorMsg, setErrorMsg] = useState<null | string>(null)
    const [loading, setLoading] = useState<boolean>(true)

    const auth = useContext(AuthContext)
    useEffect(() => {
        if(auth.state.token === null){
            auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : []})
        }
    }, [])

    useEffect(()=>{
        if(auth.state.token !== null) {
            fetch("/api/auth/", {
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
                console.log(data)
                if(data.success)
                auth.dispatch({type : AuthActionTypes.GET_AUTH, payload : {
                    isAdmin : data.data.user.isAdmin,
                    isStarted : true
                }})
                else{
                    console.log(data.msg)
                }
                setLoading(false)
            })
        }
    }, [auth.state.token])

    const handleSubmit = async (e:any) => {
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
                        points: points,
                        tags: "",
                        statement: statement,
                        constraints: constraints,
                        inpFormat: "",
                        outFormat: "",
                        samInput: sampleInput,
                        samOutput: sampleOutput,
                        testcase: tcInput,
                        answer: tcOutput,
                        unlockCost: unlockScore,
                        penalty: penalty,
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
            if(data.success){
                setErrorMsg(null)
                handleQuesId(null)
                handlePoints(null)
                handleSampleInput("")
                handleSampleOutput("")
                handlePenalty(null)
                handleTcInput("")
                handleTcOuput("")
                handleConstraints("")
                handleUnlockScore(null)
                handleStatement("")
                handleName("")
            }
            else{
                setErrorMsg(data.msg)
            }
        })
    }    

    if(loading){
        return <div>insert loading animation here</div>
    }

    if(auth.state.token === "x"){
        return <Redirect to="/login" />
    }

    if(auth.state.token !== null && auth.state.token !== "x" && !auth.state.isAdmin){
        return <Redirect to = "/"/>
    }

    return <div className="admin">
        {   errorMsg?
            <b> {errorMsg} </b>
            :
            null
        }
        <h3>Name</h3>
        <textarea className="short" name="name" onChange={e => handleName(e.target.value)} />
        <h3>Question Id</h3>
        <textarea className="short" name="quesId" onChange={e => handleQuesId(e.target.value as unknown as number)} />
        <h3>Points</h3>
        <textarea className="short" name="points" onChange={e => handlePoints(e.target.value as unknown as number)} />
        <h3>Penalty</h3>
        <textarea className="short" name="penalty" onChange={e => handlePenalty(e.target.value as unknown as number)} />
        <h3>Unlock Cost</h3>
        <textarea className="short" name="cost" onChange={e => handleUnlockScore(e.target.value as unknown as number)} />
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
    </div>
}

export default AdminPage;