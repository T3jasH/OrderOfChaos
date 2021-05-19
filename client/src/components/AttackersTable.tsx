import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { IleaderboardPlayer, Iattacker } from "../Pages/LeaderboardPage"

interface props {
    leaderboardPlayers: IleaderboardPlayer[] | undefined
    attackersP: Iattacker[] | undefined
    handleAttack: any
}

const AttackersTable = ({
    leaderboardPlayers,
    attackersP,
    handleAttack,
}: props) => {
    const [attackers, setAttackers] = useState<Iattacker[] | undefined>(
        attackersP
    )
    const auth = useContext(AuthContext)

    useEffect(() => {
        setAttackers(attackersP)
    }, [attackersP])

    useEffect(() => {
        setAttackers((prev) =>
            prev?.map((a) => ({
                ...a,
                rank: leaderboardPlayers?.findIndex(
                    (player: IleaderboardPlayer) =>
                        player.username === a.username
                ),
            }))
        )
    }, [attackersP])

    const minsAgo = (date: any) => {
        var diff = parseInt(
            (((Date.now() - new Date(date).getMilliseconds()) /
                (1000 * 60)) as unknown) as string
        )
        var text = " mins ago"
        if (diff >= 120) {
            diff = 120
            text = "+ mins ago"
        }
        return `${diff}${text}`
    }

    return (
        <table className="attackers-table">
            <thead>
                <tr className="table-heading" style={{ color: "purple" }}>
                    <td className="leaderboard-table-heading">Position</td>
                    <td className="leaderboard-table-heading">Name</td>
                    <td className="table-space-attack"></td>
                    <td className="leaderboard-table-heading">Score</td>
                    <td className="leaderboard-table-heading">
                        No. of times
                        <br /> attacked you
                    </td>
                    <td className="leaderboard-table-heading">
                        Time of <br /> attack
                    </td>
                </tr>
            </thead>
            <tbody>
                {attackers?.map((attacker, idx) => {
                    return (
                        <tr>
                            <td>{attacker.rank}</td>
                            <td
                                id={
                                    auth.state.id === attacker._id
                                        ? "current-player"
                                        : ""
                                }
                            >
                                {attacker.username}
                            </td>

                            <td className="table-space-attack"></td>
                            <td>
                                {
                                    leaderboardPlayers?.find(
                                        (d) => d.username === attacker.username
                                    )?.score
                                }
                            </td>
                            <td>
                                {
                                    leaderboardPlayers
                                        ?.find(
                                            (p) =>
                                                p.username ===
                                                auth.state.username
                                        )
                                        ?.attackers.map(
                                            (a) =>
                                                a.username === attacker.username
                                        ).length
                                }
                            </td>
                            <td>{minsAgo(attacker.date)}</td>
                            <td>
                                <button
                                    onClick={() => handleAttack(attacker._id)}
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

export default AttackersTable
