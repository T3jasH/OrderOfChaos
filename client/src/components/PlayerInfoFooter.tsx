import React, { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { PlayerContext } from "../context/PlayerContext"
import "../styles/Footer.css"

interface props {
    rank: number | null
    active: boolean | undefined | null
}

const PlayerInfoFooter: React.FC<props> = ({ rank, active }) => {
    const auth = useContext(AuthContext).state
    const player = useContext(PlayerContext).state
    const history = useHistory()

    var attacksOnPlayer: number | null = 8
    const newAttacksCount = () => {
        var cnt = 0
        if (player.attacks)
            for (var i = 0; i < player.attacks.length; i++) {
                if (!player.attacks[i].seen) {
                    cnt++
                }
            }
        return cnt === 0 ? null : cnt
    }
    attacksOnPlayer = newAttacksCount()

    return (
        <div className="footer">
            <div className="info-container" style={{ marginLeft: "0px" }}>
                <p>Username</p>
                <p className="field-value">{auth.username}</p>
            </div>
            <div className="info-container">
                <p>Score</p>
                <p className="field-value">{player.score}</p>
            </div>
            <div className="info-container">
                <p>Rank</p>
                <p className="field-value">{rank ? rank : "-"}</p>
            </div>

            <div className="info-container">
                <p>Attacks Left</p>
                <p className="field-value">{player.attacksLeft}</p>
            </div>
            <div className="info-container">
                <p>Attacks Faced</p>
                <p className="field-value">{player.attacks.length}</p>
            </div>
            <div
                className="info-container"
                style={{ display: active ? "none" : "block" }}
            >
                <button
                    id="btn-attackers"
                    style={{ display: active ? "none" : "block" }}
                    onClick={(e) => {
                        history.push("/attackers")
                    }}
                >
                    Attackers
                </button>
                <div
                    id="new-attacks-counter"
                    className="glow"
                    onClick={(e) => {
                        if (active) {
                            return
                        }
                        history.push("/attackers")
                    }}
                    style={{
                        display:
                            attacksOnPlayer === 0 || attacksOnPlayer === null
                                ? "none"
                                : "block",
                    }}
                >
                    {attacksOnPlayer === null || attacksOnPlayer === 0
                        ? null
                        : attacksOnPlayer > 9
                        ? "9+"
                        : attacksOnPlayer}
                </div>
            </div>
        </div>
    )
}

export default PlayerInfoFooter
