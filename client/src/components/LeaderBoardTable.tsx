import React from "react"
import { IleaderboardPlayer } from "../Pages/LeaderboardPage"

interface props {
    leaderboardPlayers: IleaderboardPlayer[] | undefined
    auth: any
    handleAttack: any
}

const LeaderBoardTable = ({
    leaderboardPlayers,
    auth,
    handleAttack,
}: props) => {
    return (
        <table cellSpacing={20}>
            <thead>
                <tr className="table-heading" style={{ color: "purple" }}>
                    <td className="leaderboard-table-heading">Position</td>
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
                                <button
                                    onClick={() => handleAttack(player._id)}
                                    className="leaderboard-button"
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
