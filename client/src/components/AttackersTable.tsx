import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { PlayerContext } from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import { Iattacker } from "../Pages/LeaderboardPage"
import { getAttackersCount } from "../utils"

interface props {
    attackersP: Iattacker[] | null | undefined
    handleAttack: any
}

const AttackersTable = ({
    attackersP,
    handleAttack,
}: props) => {
    const [attackers, setAttackers] = useState<Iattacker[] | undefined>(
        undefined
    )
    const auth = useContext(AuthContext)
    const playerContext = useContext(PlayerContext)


    useEffect(() => {
        if(attackersP)
        setAttackers(attackersP)
    }, [attackersP])

    //Set all attacks as seen

    useEffect(() => {
        if(auth.state.token && playerContext.state.attacks?.length){
        if(playerContext.state.attacks.find(att => att.seen === false) !== undefined)
        fetch("/api/attacklogs", {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
                "Content-type": "application/json",
                "x-auth-token": auth.state.token
            }
        })
        .then(response => response.json())
        .catch(err => console.log(err))
        .then(data => {
            if(data.success){
                playerContext.dispatch({type: PlayerActionTypes.SET_SEEN, payload: []})
            }
            else{
                console.log(data.msg)
            }
        })
    }
    // eslint-disable-next-line
    }, [playerContext.state.attacks])

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

    // LOADING ANIMATION NEEDED
    if(attackers === null){
        return <div>
                <h2 id="no-attacks" >There have been no attacks on you</h2>
                </div>
    }
       
    return (
        attackers !== undefined && attackers?.length !== 0 ?
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
                                    getAttackersCount(playerContext.state.attacks, attacker)
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
        :
        <h2>
            Loading
        </h2>
    )
}

export default AttackersTable
