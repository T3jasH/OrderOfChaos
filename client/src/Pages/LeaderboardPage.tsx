import { useContext, useEffect, useState } from "react"

import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { getUser } from "../utils"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { getLeaderboard } from "../utils"
import { useHistory } from "react-router-dom"
import LeaderboardHeader from "../components/LeaderboardHeader"
import LeaderboardTable from "../components/LeaderBoardTable"
import "../styles/LeadboardPage.css"

import Navbar from "../components/Navbar"
import PlayerInfoFooter from "../components/PlayerInfoFooter"
import AttackersTable from "../components/AttackersTable"

export interface IleaderboardPlayer {
    username: string
    _id: string
    score: number
    attackers: Iattacker[]
}

export interface Iattacker {
    seen: boolean
    username: string
    date: string
    _id: string
    rank: number | undefined
}
const LeaderboardPage = () => {
    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext)
    const history = useHistory()
    const [tabState, setTabState] = useState<any>("leaderboard")

    const [leaderboardPlayers, setLeaderboardPlayers] = useState<
        IleaderboardPlayer[]
    >()
    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
    })

    useEffect(() => {
        if (auth.state.token !== null && auth.state.token !== "x") {
            getLeaderboard(auth).then((data) => {
                setLeaderboardPlayers(data)
            })
            getUser(auth)
        }
    }, [auth.state.token])

    const [rank, setRank] = useState<number | null>(null)

    useEffect(() => {
        if (auth.state.id.length) {
            getLeaderboard(auth).then((data) => {
                setRank(
                    data.findIndex((user: any) => user._id === auth.state.id) +
                        1
                )
            })
        }
    }, [auth.state.id])

    useEffect(() => {
        if (leaderboardPlayers?.length) {
            auth.dispatch({ type: AuthActionTypes.SET_LOADING, payload: [] })
        }
    }, [leaderboardPlayers])

    const scroll = () => {
        if (window.location.hash) {
            console.log(
                String(window.location.hash).substring(
                    1,
                    String(window.location.hash).length
                )
            )
            document
                .getElementById(
                    String(window.location.hash).substring(
                        1,
                        String(window.location.hash).length
                    )
                )
                ?.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleAttack = (id: string) => {
        if (contextPlayer.state.attacksLeft <= 0) {
            alert("You don't have any attacks!")
            return
        }

        if (auth.state.token) {
            console.log("Is this getting called")
            fetch(`/api/leaderboard/${id}`, {
                method: "POST",
                headers: {
                    "x-auth-token": auth.state.token,
                    "Content-type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    contextPlayer.dispatch({
                        type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
                        payload: contextPlayer.state.attacksLeft - 1,
                    })
                    getLeaderboard(auth).then((data) => {
                        setLeaderboardPlayers(data)
                    })
                })
                .catch((e) => console.log(e))
        }
    }

    console.log(leaderboardPlayers)
    if (auth.state.loading) return <div> loading..</div>
    return (
        <div className="leaderboard-page">
            <Navbar />
            <div className="leaderboard-container">
                {scroll()}
                <button onClick={() => history.goBack()}>{"<Back"}</button>
                <h3>
                    <span
                        className={tabState !== "leaderboard" ? "fade" : ""}
                        onClick={() => setTabState("leaderboard")}
                    >
                        Leaderboard
                    </span>
                    <span id="slash">/</span>
                    <span
                        className={tabState !== "attackers" ? "fade" : ""}
                        onClick={() => setTabState("attackers")}
                    >
                        Attackers
                    </span>
                </h3>
                {tabState === "leaderboard" ? (
                    <LeaderboardTable
                        leaderboardPlayers={leaderboardPlayers}
                        auth={auth}
                    />
                ) : (
                    <AttackersTable
                        leaderboardPlayers={leaderboardPlayers}
                        auth={auth}
                        //ACTUAL CODE BUT I DON'T HAVE ATTACKERS
                        // attackers={
                        //     leaderboardPlayers?.find(
                        //         (d) => d._id === auth.state.id
                        //     )?.attackers
                        // }

                        //TO TEST ATTACKERS
                        attackersP={
                            leaderboardPlayers?.find(
                                (d) => d._id === "609c0d2a812f61639029a6e9"
                            )?.attackers
                        }
                    />
                )}
            </div>
            <PlayerInfoFooter rank={rank} active={tabState === "attackers"} />
        </div>
    )
}
export default LeaderboardPage

// <div style={{ display: "flex", flexDirection: "column" }}>
//     {leaderboardPlayers?.map((player) => {
//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     width: "50%",
//                     margin: "auto",
//                     padding: "10px",
//                     backgroundColor:
//                         player._id === auth.state.id
//                             ? "yellow"
//                             : "pink",
//                 }}
//             >
//                 <div style={{ width: "300px" }} id={player._id}>
//                     {player.username}
//                 </div>
//                 <div style={{ width: "300px" }}>
//                     {player.score}
//                 </div>
//                 <div style={{ width: "300px" }}>
//                     {player.attackers.length}
//                 </div>

//                 {player._id !== auth.state.id && (
//                     <button
//                         style={{ backgroundColor: "cyan" }}
//                         onClick={() => handleAttack(player._id)}
//                     >
//                         Attack
//                     </button>
//                 )}
//             </div>
//         )
//     })}
// </div>
