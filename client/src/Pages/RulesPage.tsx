import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/Rules.css"
import { Loading } from "../utils"

const RulesPage: React.FC = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
    const [days, setDays] = useState<number>(0)
    const [hours, setHours] = useState<number>(0)
    const [minutes, setMinutes] = useState<number>(0)
    const [seconds, setSeconds] = useState<number | null>(0)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: {} })
        var deadline = new Date("june09, 2021 20:00:00").getTime()
        var x = setInterval(function () {
            var now = new Date().getTime()
            var t = deadline - now
            setDays(Math.floor(t / (1000 * 60 * 60 * 24)))
            setHours(Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
            setMinutes(Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)))
            setSeconds(Math.floor((t % (1000 * 60)) / 1000))

            if (t <= 0) {
                clearInterval(x)
                setSeconds(null)
            }
        }, 1000)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    if (loading === true) {
        return <Loading />
    }
    var dispD,dispH,dispM,dispS;
    if(days===0)dispD="hide-ctdn";
    if(days===0 && hours===0)dispH="hide-ctdn";
    if(days===0 && hours===0 && minutes===0)dispM="hide-ctdn";
    if(days===0 && hours===0 && minutes===0 && seconds===0)dispS="hide-ctdn";
        
    return (
        <div className="rules">
            <div className="rules-page-container">
                <div className="rules-nav">
                    <button
                        onClick={() => history.goBack()}
                        className="back-btn"
                    >
                        {`<Back`}
                    </button>
                    {/* <h2>RULES</h2> */}
                    <button
                        className="logout-btn"
                        onClick={(e) => {
                            auth.dispatch({
                                type: AuthActionTypes.LOGOUT,
                                payload: [],
                            })
                            history.push("/login")
                        }}
                        style={
                            auth.state.token !== "x"
                                ? {}
                                : { color: "transparent" }
                        }
                    >
                        Logout
                    </button>
                </div>
                <h2>RULES</h2>
                <div>
                    <div className="contactusbtn">
                        Contact Us <br />
                        Tushar - 7277608856 <br />
                        Rhea - 9538649509
                    </div>
                    <ol className="rules-list">
                        <li>This is an induvidual player contest</li>
                        <li>
                            The contest will be held on June 9, from 8 PM to 10
                            PM IST. Registration will be open throughout the
                            contest.
                        </li>
                        <li>
                            Participants are required to save their code for all
                            submissions, and can be asked to send it at the end
                            of the contest.
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
                            every wrong submission, you lose points. Penalty
                            depends on the level of difficulty of the question.
                        </li>
                        <li>
                            A correct submission on first attempt on an easy
                            question gives you an attack to use on another
                            player. Similarly for a medium question you get an
                            attack for a correct submission in one of the first
                            2 attempts, and for a hard question on one of the
                            first 3 attempts.
                        </li>
                        <li>
                            You can select a player to attack from the
                            leaderboard or attacker's list.
                        </li>
                    </ol>
                </div>
            </div>
            <div className="countdown-container">
                <h2>
                    {seconds != null
                        ? "CONTEST STARTS IN"
                        : "CONTEST HAS STARTED"}
                </h2>
                {seconds != null ? (
                    <>
                        <div  className={dispD}>{`${days} DAYS  `}</div>
                        <div  className={dispH}>{`${hours}  HOURS  `}</div>
                        <div  className={dispM}>{`${minutes} MINUTES  `}</div>
                        <div  className={dispS}>{`${seconds} SECONDS`}</div>
                    </>
                ) : null}
            </div>
        </div>
    )
}

export default RulesPage
