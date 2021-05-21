import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import { getUser, getLeaderboard, sortAttackers } from "../utils"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
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
    score: number
    numberOfAttacks: number
}

interface props{
    currentPage: string
}

const LeaderboardPage = ({currentPage} : props) => {
    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext)
    const history = useHistory()
    const [tabState, setTabState] = useState<string>(currentPage)
    const [attackersP, setAttackersP] = useState<Iattacker[] | undefined>([])
    const [leaderboardPlayers, setLeaderboardPlayers] = useState<IleaderboardPlayer[]>()
    const [rank, setRank] = useState<number | null>(null)
    const [attackStatus, setAttackStatus] = useState<string | null>(null)

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


    useEffect(() => {
        if (auth.state.id.length && auth.state.token !== "x") {
            getLeaderboard(auth)
            .then((data) => {
                setLeaderboardPlayers(data.ranks.map((obj:any, idx:any) => {
                    return {
                        ...obj, 
                        attackers : data.attackers[idx],
                    }
                }))
                setRank(
                    data.ranks.findIndex((user: any) => user._id === auth.state.id) +
                        1
                )
            })
        }
    }, [auth.state.id])

    useEffect(() => {
        if (leaderboardPlayers?.length) {
            setAttackersP(
                sortAttackers(leaderboardPlayers, auth)
            )
            auth.dispatch({ type: AuthActionTypes.SET_LOADING, payload: [] })
        }
        console.log(leaderboardPlayers)
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
            setAttackStatus("You don't have attacks")
            setTimeout(() => setAttackStatus(null), 5000)
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
                    console.log(data, "ATTACK DATA")
                    if(data.success){
                    contextPlayer.dispatch({
                        type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
                        payload: {attacksLeft: contextPlayer.state.attacksLeft - 1},
                    })
                    getLeaderboard(auth).then((data) => {
                        setLeaderboardPlayers(data.ranks.map((obj:any, idx:any) => {
                            return {
                                ...obj, 
                                attackers : data.attackers[idx],
                            }
                        }))
                        setRank(
                            data.ranks.findIndex((user: any) => user._id === auth.state.id) +
                                1
                        )
                    })
                }
                setAttackStatus(data.msg)
                setTimeout(() => setAttackStatus(null), 5000)
                })
                .catch((e) => console.log(e))   
        }
    }    

    if (auth.state.loading) return <div> loading..</div>
    return (
        <div className="leaderboard-page">
        <h2 className="mobile-message" >Switch to PC for a better experience</h2>    
        <div 
        className="status-container"
        style={{display : attackStatus === null ? "none" : "flex"}}
        >
            <p className="attack-status">
                {attackStatus}
            </p>
        </div>
            <Navbar />
            <div className="leaderboard-container">
                {scroll()}
                <button onClick={() => history.goBack()}>{"<Back"}</button>
                <h3>
                    <span
                        className={tabState !== "leaderboard" ? "fade" : ""}
                        onClick={() => {setTabState("leaderboard")}}
                    >
                        Leaderboard
                    </span>
                    <span id="slash">/</span>
                    <span
                        className={tabState !== "attackers" ? "fade" : ""}
                        onClick={() => {setTabState("attackers")}}
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
                        leaderboardPlayers={leaderboardPlayers}
                        handleAttack={handleAttack}
                        attackersP={
                            attackersP
                        }
                    />
                )}
                {console.log(attackersP)}
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
