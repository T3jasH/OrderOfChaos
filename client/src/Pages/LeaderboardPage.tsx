import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { getUser } from "../utils"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { getLeaderboard } from "../utils"
import { useHistory } from "react-router-dom"
import LeaderboardHeader from "../components/LeaderboardHeader"
import "../styles/LeadboardPage.css"

import Navbar from "../components/Navbar"
import PlayerInfoFooter from "../components/PlayerInfoFooter"

export interface IleaderboardPlayers {
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
}
const LeaderboardPage = () => {
    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext)
    const history = useHistory()

    const [leaderboardPlayers, setLeaderboardPlayers] = useState<
        IleaderboardPlayers[]
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
                    <span>Leaderboard</span>/<span>Attackers</span>
                </h3>
                <table cellSpacing={50}>
                    <thead>
                        <tr
                            className="table-heading"
                            style={{ color: "purple" }}
                        >
                            <td className="leaderboard-table-heading">
                                Position
                            </td>
                            <td className="leaderboard-table-heading">Name</td>
                            <td className="table-space"></td>
                            <td className="leaderboard-table-heading">Score</td>
                            <td className="leaderboard-table-heading">
                                No. of times
                                <br /> attacked
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardPlayers?.map((player, idx) => {
                            return (
                                <tr>
                                    <td>{idx + 1}</td>
                                    <td
                                        id={
                                            auth.state.id === player._id
                                                ? "current-player"
                                                : ""
                                        }
                                    >
                                        {player.username}
                                    </td>

                                    <td className="table-space"></td>
                                    <td>{player.score}</td>
                                    <td>{player.attackers.length}</td>
                                    <td>
                                        <button className="leaderboard-button">
                                            Attack
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <PlayerInfoFooter rank={rank} />
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
