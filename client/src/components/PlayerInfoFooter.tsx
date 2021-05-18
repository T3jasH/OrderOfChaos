import React, { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { PlayerContext } from "../context/PlayerContext"
import "../styles/Footer.css"

interface props {
    rank: number | null
    active: boolean | undefined | null
}

const PlayerInfoFooter: React.FC<props> = ({ rank, active}) => {
    const auth = useContext(AuthContext).state
    const player = useContext(PlayerContext).state
    const history = useHistory()

    var attacksOnPlayer = null;
    const newAttacksCount = () => {
        var cnt=0;
        if(player.attacks)
        for(var i=0; i<player.attacks.length; i++){
          if(!player.attacks[i].seen){
            cnt++;
          }
        }
        return cnt === 0 ? null : cnt
      }

    return (
        <div className="footer">
            <div className="info-container" style={{ marginLeft: "0px" }}>
                <p>Username:</p>
                <button
                    className="field-value"
                    onClick={(e) => history.push(`/leaderboard#${auth.id}`)}
                >
                    {auth.username}
                </button>
            </div>
            <div className="info-container">
                <p>Score:</p>
                <p className="field-value number">{player.score}</p>
            </div>
            <div className="info-container">
                <p>Rank:</p>
                <button
                    className="field-value number"
                    onClick={(e) => history.push(`/leaderboard#${auth.id}`)}
                >
                    {rank ? rank : "-"}
                </button>
            </div>

            <div className="info-container">
                <p>Attacks Left:</p>
                <p className="field-value number">{player.attacksLeft}</p>
            </div>
            <div className="info-container">
                <p>Attacks:</p>
                <p className="field-value number">{player.attacks.length}</p>
            </div>
            <div className="info-container">
                <button
                    id="btn-attackers"
                    className={active ? "attack-active" : ""}
                    onClick={(e) => {
                        if(active){
                            return
                        }
                        history.push("/attackers")
                    }}
                >
                    Attackers
                </button>
                <div className="new-attacks-counter"
                     onClick={(e) => {
                        if(active){
                            return
                        }
                        history.push("/attackers")
                    }}
                    style = {{display : attacksOnPlayer === 0 || attacksOnPlayer === null ? "none" : "block"}}
                >
                    {
                        attacksOnPlayer === null || attacksOnPlayer === 0? null : attacksOnPlayer > 9 ? "9+" : attacksOnPlayer 
                    }
                    </div>
            </div>
        </div>
    )
}

export default PlayerInfoFooter
