import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { getUser } from "../utils"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { getLeaderboard } from "../utils"
import { useHistory } from "react-router-dom"
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

interface props {
    defaultTabState: string
}
const LeaderboardPage = ({ defaultTabState }: props) => {
    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext)
    const history = useHistory()
    const [tabState, setTabState] = useState<any>(defaultTabState)
    const [attackersP, setAttackersP] = useState<Iattacker[]>([])

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
            getUser(auth, contextPlayer)
        }
    }, [auth.state.token])

    const [rank, setRank] = useState<number | null>(null)

    useEffect(() => {
        if (auth.state.id.length) {
            getLeaderboard(auth)
            .then((data) => {
                console.log(data)
                setLeaderboardPlayers(data.ranks.map((obj:any, idx:any) => {
                    return {
                        ...obj, 
                        attackers : data.attackers[idx]
                    }
                }))
                setRank(
                    data.ranks.findIndex((user: any) => user._id === auth.state.id) +
                        1
                )
            })
        }
    }, [auth.state.id, tabState])

    useEffect(() => {

        console.log(leaderboardPlayers)
        if (leaderboardPlayers?.length) {
            var att = leaderboardPlayers.find(player => player._id === "609c0d2a812f61639029a6e9")?.attackers
            att = att?.map((obj:any) => {
                obj.date = new Date(obj.date).getMilliseconds()
                return obj
            })
            att?.sort((firstAttacker:any, secondAttacker:any) => 
            firstAttacker.date < secondAttacker.date ? 1 : 0
            )
            auth.dispatch({ type: AuthActionTypes.SET_LOADING, payload: [] })
        }
    }, [leaderboardPlayers])

    const scroll = () => {
        if (window.location.hash) {
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
        console.log(id)
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
                    console.log(data)
                    if(data.success){
                    contextPlayer.dispatch({
                        type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
                        payload: contextPlayer.state.attacksLeft - 1,
                    })
                    getLeaderboard(auth).then((data) => {
                        
                        setLeaderboardPlayers( 
                            data.ranks.map((player:any, idx:any) => {
                                console.log(data.attackers[idx])
                                return{
                                    ...player, 
                                    attackers: data.attackers[idx]
                                }
                            })
                         )
                        setRank(
                            data.ranks.findIndex((user: any) => user._id === auth.state.id) +
                                1
                        )
                    })
                }
                else{
                    console.log("Someting's wrong")
                }
                })
                .catch((e) => console.log(e))
        }
    }

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
                        onClick={() => history.push("/leaderboard")}
                    >
                        Leaderboard
                    </span>
                    <span id="slash">/</span>
                    <span
                        className={tabState !== "attackers" ? "fade" : ""}
                        onClick={() => history.push("/attackers")}
                    >
                        Attackers
                    </span>
                </h3>
                {tabState === "leaderboard" ? (
                    <LeaderboardTable
                        leaderboardPlayers={leaderboardPlayers}
                        auth={auth}
                        handleAttack={handleAttack}
                    />
                ) : (
                    <AttackersTable
                        leaderboardPlayers={leaderboardPlayers}
                        handleAttack={handleAttack}
                        //ACTUAL CODE BUT I DON'T HAVE ATTACKERS
                        // attackersP={
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
