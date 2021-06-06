import React, { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { PlayerContext } from "../context/PlayerContext"
import { IleaderboardPlayer } from "../Pages/LeaderboardPage"
import { getAttackersCount } from "../utils"

interface props {
    leaderboardPlayers: IleaderboardPlayer[] | undefined | null
    handleAttack: any
    btnDisable: boolean
    setBtnDisable: any
}

const LeaderBoardTable = ({ leaderboardPlayers, handleAttack, btnDisable, setBtnDisable }: props) => {
    const auth = useContext(AuthContext)
    const contextPlayer = useContext(PlayerContext).state
    
    if(leaderboardPlayers?.length === 0){
        return <div id="no-attacks">
        <h2>
            Start solving!
            </h2>
        </div>
    }

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
                        <tr key={player._id}>
                            <td
                                className={
                                    auth.state.id === player._id
                                        ? `current-player`
                                        : ""
                                }
                            >
                                {idx + 1}
                            </td>
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
                            <td
                                className={
                                    auth.state.id === player._id
                                        ? `current-player`
                                        : ""
                                }
                            >
                                {player.score}
                            </td>
                            <td
                                className={
                                    auth.state.id === player._id
                                        ? `current-player`
                                        : ""
                                }
                            >
                                {getAttackersCount(
                                    contextPlayer.attacks,
                                    player
                                )}
                            </td>
                            <td style={{ padding: "1rem" }}>
                                <button
                                    onClick={() => {
                                        if(player._id !== auth.state.id){
                                            setTimeout(() => setBtnDisable(false), 2500)
                                            setBtnDisable(true)
                                        }
                                        handleAttack(player._id)
                                    }}
                                    className={`leaderboard-button ${
                                        player.attackers.length === 15 ||
                                        auth.state.id === player._id || btnDisable || auth.state.isEnded
                                            ? "disable-button"
                                            : "hvr-bounce-to-right"
                                    }`}
                                >
                                    Attack
                                </button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default LeaderBoardTable
