import React, {useContext} from "react"
import {PlayerContext} from "../context/PlayerContext"
import "../styles/AttackLog.css"

const AttackLog : React.FC = () => {

    const attacks = useContext(PlayerContext).state.attacks

    return <div className="attack-log">
        {
            attacks.map((item)=>
                   <div className="attack">
                       {`Attacker : ${item.username}   ${item.date}`} 
                    </div>
                
            )
        }
    </div>
}

export default AttackLog;