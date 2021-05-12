import React, {useContext, useState} from "react"
import { AuthContext } from "../context/AuthContext"
import {PlayerContext} from "../context/PlayerContext"
import { PlayerActionTypes } from "../context/PlayerReducer"
import "../styles/AttackLog.css"

const AttackLog : React.FC = () => {

    const [navbarClosed, toggleNavbar] = useState<boolean>(true)
    const auth = useContext(AuthContext).state

    const setSeen = () => {
        if(auth.token)
        fetch("/api/attacklogs", {
            method : "POST",
            headers : {
                "Content-type" : "application/json",
                "x-auth-token" : auth.token
            },
            body : JSON.stringify({})
        })
        .then(resp => resp.json())
        .catch(err => console.log(err))
        .then(data => {
            if(!data.success){
                console.log(data, "not set to seen")
            }
        })
        else{
            console.log("If you are seeing this message, something's not right")
        }
    }

    const handleNavbar = () => {
        if(navbarClosed){
            document.getElementById("attack-nav")?.setAttribute("style", "width : 18vw;");
            const items = document.getElementsByClassName("attack")
            for(var i=0; i<items.length; i++){
                items[i].setAttribute("style", "display : flex;");
            }
            setSeen()
        }
        else{
            document.getElementById("attack-nav")?.setAttribute("style", "width : 4vw;");
            const items = document.getElementsByClassName("attack")
            player.dispatch({type : PlayerActionTypes.SET_SEEN, payload : []})
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

    const player = useContext(PlayerContext)
    return <nav id="attack-nav">
        <ul className="attack-list">
            <li className="icon" 
            style = {{cursor : "pointer"}}
            onClick={handleNavbar}
            >ic</li>
        {
            player.state.attacks.length?
            player.state.attacks.map((item)=>{
                var t = parseInt( ((Date.now() - (new Date(item.date)).getTime()) / (1000 * 60)) as unknown as string )
                var s = " minutes ago"
                if(t>120){
                    s="+ minutes ago"
                    t=120
                }
                return(
                   <li className="attack" style = {{backgroundColor : item.seen? "#f23d49" : "yellow"}}>
                       {`${item.username}  attacked  ${t}${s}`} 
                    </li>)
            }
            )
            : "No attacks to display"
        }
        </ul>
    </nav>
}

export default AttackLog;