import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { getUser, getLeaderboard, sortAttackers, Loading } from "../utils"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { Redirect, useHistory } from "react-router-dom"
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
    score: number
    numberOfAttacks: number
}

interface props {
    currentPage: string
}

const LeaderboardPage = ({ currentPage }: props) => {
    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext)
    const history = useHistory()
    const [tabState, setTabState] = useState<string>(currentPage)
    const [attackersP, setAttackersP] = useState<Iattacker[] | null | undefined>(undefined)
    const [leaderboardPlayers, setLeaderboardPlayers] = useState<
        IleaderboardPlayer[]
    >()
    const [rank, setRank] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
    })

    useEffect(() => {
        if (auth.state.token !== null && auth.state.token !== "x") {
            getUser(auth, contextPlayer)
        }
        // eslint-disable-next-line
    }, [auth.state.token])

    useEffect(() => {
        if (auth.state.isStarted === false) {
            setLoading(false)
            return
        }
        if (auth.state.id.length && auth.state.token !== "x") {
            getLeaderboard(auth).then((data) => {
                setLeaderboardPlayers(
                    data.ranks.map((obj: any, idx: any) => {
                        return {
                            ...obj,
                            attackers: data.attackers[idx],
                        }
                    })
                )
                setRank(
                    data.ranks.findIndex(
                        (user: any) => user._id === auth.state.id
                    ) + 1
                )
            })
        }
        // eslint-disable-next-line
    }, [auth.state])

    useEffect(() => {
        if (leaderboardPlayers?.length) {
            setAttackersP(sortAttackers(leaderboardPlayers, auth))
        }
        // eslint-disable-next-line
    }, [leaderboardPlayers])

    useEffect(() => {
        if (attackersP !== undefined) {
            setLoading(false)
        }
    }, [attackersP])

    const handleAttack = (id: string) => {
        if (auth.state.isEnded) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "Contest has ended", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3500)
            return
        }

        if (contextPlayer.state.attacksLeft <= 0) {
            auth.dispatch({
                type: AuthActionTypes.SET_MESSAGE,
                payload: { msg: "You don't have any attacks.", type: "fail" },
            })
            setTimeout(() => {
                auth.dispatch({
                    type: AuthActionTypes.CLEAR_MESSAGE,
                    payload: {},
                })
            }, 3500)
            return
        }
        if (auth.state.token) {
            fetch(`/api/leaderboard/${id}`, {
                method: "POST",
                headers: {
                    "x-auth-token": auth.state.token,
                    "Content-type": "application/json",
                },
            })
                .then((response) => response.json())
                .catch((err) => console.log(err))
                .then((data) => {
                    // console.log(data, "ATTACK DATA")
                    if (data.success) {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "success" },
                        })
                        contextPlayer.dispatch({
                            type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
                            payload: {
                                attacksLeft:
                                    contextPlayer.state.attacksLeft - 1,
                            },
                        })
                        getLeaderboard(auth).then((data) => {
                            setLeaderboardPlayers(
                                data.ranks.map((obj: any, idx: any) => {
                                    return {
                                        ...obj,
                                        attackers: data.attackers[idx],
                                    }
                                })
                            )
                            setRank(
                                data.ranks.findIndex(
                                    (user: any) => user._id === auth.state.id
                                ) + 1
                            )
                        })
                    } else {
                        auth.dispatch({
                            type: AuthActionTypes.SET_MESSAGE,
                            payload: { msg: data.msg, type: "fail" },
                        })
                    }
                    setTimeout(() => {
                        auth.dispatch({
                            type: AuthActionTypes.CLEAR_MESSAGE,
                            payload: {},
                        })
                    }, 3500)
                })
                .catch((e) => console.log(e))
        }
    }

    if (loading) return <Loading />

    if (auth.state.isStarted === false) {
        return <Redirect to="/rules" />
    }

    return (
        <div className="leaderboard-page">
            <h2 className="mobile-message">
                Switch to PC for a better experience
            </h2>
            <Navbar removeButton={true} />
            <div className="leaderboard-container">
                <button onClick={() => history.goBack()}>{"<Back"}</button>
                <h3>
                    <span
                        className={tabState !== "leaderboard" ? "fade" : ""}
                        onClick={() => {
                            setTabState("leaderboard")
                        }}
                    >
                        Leaderboard
                    </span>
                    <span id="slash">/</span>
                    <span
                        className={tabState !== "attackers" ? "fade" : ""}
                        onClick={() => {
                            setTabState("attackers")
                        }}
                    >
                        Attackers
                    </span>
                </h3>
                {tabState === "leaderboard" ? (
                    <LeaderboardTable
                        leaderboardPlayers={leaderboardPlayers}
                        handleAttack={handleAttack}
                    />
                ) : (
                    <AttackersTable
                        handleAttack={handleAttack}
                        attackersP={attackersP}
                    />
                )}
                {/* {console.log(attackersP)} */}
            </div>
            <PlayerInfoFooter rank={rank} active={true} />
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
