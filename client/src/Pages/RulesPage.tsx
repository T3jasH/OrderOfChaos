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
            if (t < 0 && t > -5000) history.push("/")
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

    var dispD, dispH, dispM, dispS
    if (days === 0) dispD = "hide-ctdn"
    if (days === 0 && hours === 0) dispH = "hide-ctdn"
    if (days === 0 && hours === 0 && minutes === 0) dispM = "hide-ctdn"
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0)
        dispS = "hide-ctdn"
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
                        Tushar - 7277608859 <br />
                        Rhea - 9538649509
                    </div>
                    <ol className="rules-list">
                        <li>
                            This is an <b>individual player</b> contest.
                        </li>
                        <li>
                            The contest will be held on{" "}
                            <b>June 9, from 8 PM to 10 PM IST</b>. Registration
                            will be open throughout the contest.
                        </li>
                        <li>
                            Participants are required to save their code for all
                            submissions, and can be asked to send it at the end
                            of the contest. In this contest you only have to{" "}
                            <b>submit output</b> and not the code. It would be
                            easy for you to submit output if your code takes all
                            input at once and displays all output after that.
                        </li>
                        <li>
                            Once you unlock any question and get registered to
                            the leaderboard, you cannot change your network.
                            This is implemented to prevent malpractice. You can
                            contact us if you genuinely need to change your
                            network.
                        </li>
                        <li>
                            Initially you will have <b> 200 pts</b>, and all
                            questions will be locked. You have to unlock
                            questions using these points only. Unlock cost will
                            be
                            <b
                                style={{
                                    color: "#7DFD7A",
                                }}
                            >
                                {" "}
                                20 pts
                            </b>{" "}
                            for easy ,
                            <b
                                style={{
                                    color: "#fbff35",
                                }}
                            >
                                {" "}
                                30 pts
                            </b>{" "}
                            for medium and{" "}
                            <b
                                style={{
                                    color: "#ff4a4a",
                                }}
                            >
                                50 pts
                            </b>{" "}
                            for hard question.
                        </li>
                        <li>
                            There will be three levels of questions easy, medium
                            and hard. Solving an easy question gets you{" "}
                            <b
                                style={{
                                    color: "#7DFD7A",
                                }}
                            >
                                {" "}
                                100 pts
                            </b>
                            , medium gets you{" "}
                            <b
                                style={{
                                    color: "#fbff35",
                                }}
                            >
                                {" "}
                                200 pts
                            </b>{" "}
                            and hard gets you{" "}
                            <b
                                style={{
                                    color: "#ff4a4a",
                                }}
                            >
                                {" "}
                                400 pts
                            </b>
                            .
                        </li>
                        <li>
                            There is
                            <b> no limit on attempts</b> on a question, but for
                            every wrong submission, you lose points. Penalty
                            depends on the level of difficulty of the question.
                            Penalty will be
                            <b
                                style={{
                                    color: "#7DFD7A",
                                }}
                            >
                                {" "}
                                5 pts
                            </b>{" "}
                            for easy ,
                            <b
                                style={{
                                    color: "#fbff35",
                                }}
                            >
                                {" "}
                                8 pts
                            </b>{" "}
                            for medium and{" "}
                            <b
                                style={{
                                    color: "#ff4a4a",
                                }}
                            >
                                14 pts
                            </b>{" "}
                            for hard question.
                        </li>
                        <li>
                            A correct submission on{" "}
                            <b
                                style={{
                                    color: "#7DFD7A",
                                }}
                            >
                                {" "}
                                first attempt
                            </b>{" "}
                            on an easy question gives you an attack to use on
                            another player. Similarly for a medium question you
                            get an attack for a correct submission in one of the{" "}
                            <b
                                style={{
                                    color: "#fbff35",
                                }}
                            >
                                first 2 attempts
                            </b>{" "}
                            , and for a hard question on one of the
                            <b
                                style={{
                                    color: "#ff4a4a",
                                }}
                            >
                                {" "}
                                first 3 attempts
                            </b>
                            .
                        </li>
                        <li>
                            You can store at max <b>3 attacks</b> at a time.
                            When you attack a player that player loses{" "}
                            <b>20 points</b>. Any player can be attacked{" "}
                            <b>atmost 15 times</b>.
                        </li>
                        <li>
                            You can select a player to attack from the
                            <b> leaderboard or attacker's list</b>.
                        </li>
                        <li>
                            The cash prize is only for <b>MIT students</b>.
                        </li>
                    </ol>
                </div>
            </div>
            <div className="countdown-container">
                {seconds != null ? (
                    <>
                        <h2>CONTEST STARTS IN</h2>

                        <div className={dispD}>
                            {`${days} `}DAY{days > 1 ? "S" : ""}
                        </div>
                        <div className={dispH}>
                            {`${hours} `}HOUR{hours > 1 ? "S" : ""}
                        </div>
                        <div className={dispM}>
                            {`${minutes} `}MINUTE{minutes > 1 ? "S" : ""}
                        </div>
                        <div className={dispS}>
                            {`${seconds} `}SECOND{seconds > 1 ? "S" : ""}
                        </div>
                    </>
                ) : (
                    <>
                        <h2>CONTEST HAS STARTED</h2>
                    </>
                )}
            </div>
        </div>
    )
}

export default RulesPage
