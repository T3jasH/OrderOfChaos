import React from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/Rules.css"

const RulesPage: React.FC = () => {
    const history = useHistory()
    const auth = useContext(AuthContext);
   
    useEffect(() => {
        auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : {}})
        // eslint-disable-next-line
    }, [])

    return (
        <div className="rules">
            <div className="rules-container">
                <h2>RULES</h2>
                <ol className="rules-list">
                    <li>This is an induvidual player contest</li>
                    <li>
                       The contest will be held on June 9, from 8 PM to 10 PM  IST.
                       Registration will be open throughout the contest. 
                    </li>
                    <li>
                        Participants are required to save their code for all
                        submissions, and can be asked to send it at the end of
                        the contest.
                    </li>
                    <li>
                        Once the contest starts, participants must make all
                        submissions from the same device. This is to prevent
                        multiple submissions from same account. 
                    </li>
                    <li>
                        Initially you have 200 points, and all questions are
                        locked. You are to unlock questions using these
                        points (i.e, there is no currency of any sorts).
                    </li>
                    <li>
                        There is no limit on attempts on a question, but for
                        every wrong submission, you lose points. Penalty depends
                        on the level of difficulty of the question.
                    </li>
                    <li>
                        A correct submission on first attempt on an easy
                        question gives you an attack to use on another player.
                        Similarly for a medium question you get an attack for a
                        correct submission in one of the first 2 attempts, and
                        for a hard question on one of the first 3 attempts.
                    </li>
                    <li>
                        You can select a player to attack from the leaderboard
                        or attacker's list.
                    </li>
                </ol>
                <button onClick={() => history.goBack()} className="back-btn">
                    {`<Back`}
                </button>
                <button
                    className="logout-btn"
                    onClick={(e) => {
                        auth.dispatch({
                            type: AuthActionTypes.LOGOUT,
                            payload: [],
                        })
                        history.push("/login")
                    }}
                    style={auth.state.token !== "x"? {}:{display:"none"}}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default RulesPage
