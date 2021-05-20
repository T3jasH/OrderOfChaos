import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { PlayerContext } from "../context/PlayerContext"
import { IleaderboardPlayer, Iattacker } from "../Pages/LeaderboardPage"
import { getAttackersCount } from "../utils"

interface props {
    leaderboardPlayers: IleaderboardPlayer[] | undefined
    attackersP: Iattacker[] | undefined
    handleAttack: any
}

const AttackersTable = ({
    attackersP,
    handleAttack,
}: props) => {
    const [attackers, setAttackers] = useState<Iattacker[] | undefined>(
        attackersP
    )
    const auth = useContext(AuthContext)
    const playerContext = useContext(PlayerContext).state


    useEffect(() => {
        setAttackers(attackersP)
    }, [attackersP])

    const minsAgo = (date: any) => {
        var diff = parseInt(
            (((Date.now() - date) /
                (1000 * 60)) as unknown) as string
        )
        var text = " m ago"
        if (diff >= 120) {
            diff = 120
            text = "+ m ago"
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
                        Attacks on you
                    </td>
                    <td className="leaderboard-table-heading">
                        Last attack
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
                                    attacker.score
                                }
                            </td>
                            <td>
                                {
                                    getAttackersCount(playerContext.attacks, attacker)
                                }
                            </td>
                            <td>{minsAgo(attacker.date)}</td>
                            <td
                            style={{padding: "1rem"}}
                            >
                                {
                                <button
                                    onClick={() => handleAttack(attacker._id)}
                                    className={`leaderboard-button ${attacker.numberOfAttacks === 15 ? "disable-button" : ""}`}
            
                                    style={{
                                        display : auth.state.id !== attacker._id ? "block" : "none"}}>
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

export default AttackersTable
