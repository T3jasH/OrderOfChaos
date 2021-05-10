import React, {useContext, useState} from "react"
import {PlayerContext} from "../context/PlayerContext"
import "../styles/AttackLog.css"

const AttackLog : React.FC = () => {

    const [navbarClosed, toggleNavbar] = useState<boolean>(true)

    const handleNavbar = () => {
        if(navbarClosed){
            document.getElementById("attack-nav")?.setAttribute("style", "width : 18vw;");
            const items = document.getElementsByClassName("attack")
            for(var i=0; i<items.length; i++){
                items[i].setAttribute("style", "display : flex;");
            }
        }
        else{
            document.getElementById("attack-nav")?.setAttribute("style", "width : 4vw;");
            const items = document.getElementsByClassName("attack")
            for(i=0; i<items.length; i++){
                items[i].setAttribute("style", "display : none;");
            }
        }
        toggleNavbar(!navbarClosed);
    }
    // const attacks = [
    //     {date : 10, username : "attacker"},
    //     {date: 125, username : "toby"}
    // ]

    const attacks = useContext(PlayerContext).state.attacks

    return <nav id="attack-nav">
        <ul className="attack-list">
            <li className="icon" 
            style = {{cursor : "pointer"}}
            onClick={handleNavbar}
            >ic</li>
        {
            attacks.length?
            attacks.map((item)=>{
                var t = parseInt( ((Date.now() - (new Date(item.date)).getTime()) / (1000 * 60)) as unknown as string )
                var s = " minutes ago"
                if(t>120){
                    s="+ minutes ago"
                    t=120
                }
                return(
                   <li className="attack">
                       {`${item.username}  attacked  ${t}${s}`} 
                    </li>)
            }
            )
            : null
        }
        </ul>
    </nav>
}

export default AttackLog;