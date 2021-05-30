import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/Rules.css"

const RulesPage: React.FC = () => {
    const history = useHistory()
    const auth = useContext(AuthContext);
    const [days, setDays] = useState<number>(0)
    const [hours, setHours] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)
   
   
    useEffect(() => {
        auth.dispatch({type : AuthActionTypes.GET_TOKEN, payload : {}})
        var deadline = new Date("june9, 2021 20:00:00").getTime(); 
  
    var x = setInterval(function() { 
  
    var now = new Date().getTime(); 
    var t = deadline - now; 
    setDays(Math.floor(t / (1000 * 60 * 60 * 24))); 
    setHours(Math.floor((t%(1000 * 60 * 60 * 24))/(1000 * 60 * 60))); 
    setMinutes(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))); 
    setSeconds(Math.floor((t % (1000 * 60)) / 1000)); 
    
if (t < 0) { 
        clearInterval(x); 
        // Time Up
    } 
}, 1000);

        // eslint-disable-next-line
    }, [])



    return (
        <div className="rules">
            
            <div className="rules-page-container">
                <h2>
                    RULES
                </h2>
                <div className="contacts-container">
                <ul className="contacts-list">
                    <h3>
                        Contact Us
                    </h3>
                    <li>
                        Tushar - 727 7608 859
                    </li>
                    <li>
                        Rhea - 953 8649 509
                    </li>
                </ul>
                </div>
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
            <div className="countdown-container">
                <h2>
                    CONTEST STARTS IN 
                </h2>
                <span>
                {`${days} days : `}
                 </span>
                 <span>
                     {`${hours <= 9 ? "0"+hours : hours}  hours : `}
                 </span>
                 <span>
                     {`${minutes<=9 ? "0"+minutes :  minutes} minutes : `}
                 </span>
                 <span>
                     {`${seconds <= 9 ? "0"+seconds : seconds} seconds`}
                 </span>
            </div>
        </div>
    )
}

export default RulesPage
