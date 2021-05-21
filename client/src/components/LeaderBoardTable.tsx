import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { PlayerContext } from "../context/PlayerContext"
import { IleaderboardPlayer } from "../Pages/LeaderboardPage"
import { getAttackersCount } from "../utils"

interface props {
    leaderboardPlayers: IleaderboardPlayer[] | undefined
    handleAttack: any
}

const LeaderBoardTable = ({
    leaderboardPlayers,
    handleAttack,
}: props) => {

    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext).state
    return (
        <table className="leaderboard-table">
            <thead>
                <tr className="table-heading" style={{ color: "purple" }}>
                    <td className="leaderboard-table-heading">Position</td>
                    <td className="leaderboard-table-heading">Name</td>
                    <td className="table-space"></td>
                    <td className="leaderboard-table-heading">Score</td>
                    <td className="leaderboard-table-heading">
                        Attacks on you
                    </td>
                </tr>
            </thead>
            <tbody>
                {leaderboardPlayers?.map((player, idx) => {
                    
                    return (
                        <tr>
                            <td>{idx + 1}</td>
                            <td
                                className={
                                    auth.state.id === player._id
                                        ? `current-player` 
                                        : ""
                                }
                                id={player._id}
                            >
                                {player.username}
                            </td>

                            <td className="table-space"></td>
                            <td>{player.score}</td>
                            <td>{getAttackersCount(contextPlayer.attacks, player)}</td>
                            <td
                            style={{padding: "1rem"}}
                            >
                               {
                                <button
                                    onClick={() => handleAttack(player._id)}
                                    className={`leaderboard-button ${player.attackers.length === 15 ? "disable-button" : ""}`}
            
                                    style={{
                                        display : auth.state.id !== player._id ? "block" : "none"}}>
                                    Attack
                                </button>
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default LeaderBoardTable
