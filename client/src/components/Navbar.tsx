import React, { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/NavBar.css"

interface props {
    removeButton: boolean,
    scrollId: string
}

const Navbar: React.FC<props> = ({ removeButton, scrollId }) => {
    const auth = useContext(AuthContext)
    const history = useHistory()

    return (
        <div className="navbar"
        style={{
            left: removeButton? "5vw" : "10vw",
            width: removeButton? "95vw" : "90vw"
    }}
        >
            <button
                style={{ marginRight: "10vw" }}
                id="logout-btn"
                className="btn-nav"
                onClick={(e) => {
                    auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] })
                    history.push("/login")
                }}
            >
                Logout
            </button>
            <button
                onClick={() => history.push("/leaderboard")}
                className="btn-nav"
                style={{ display: removeButton ? "none" : "block" }}
            >
                Leaderboard
            </button>
            <button
                className="btn-nav"
                onClick={(e) => {
                    history.push("/rules")
                }}
                style={{ display: removeButton ? "none" : "block" }}
            >
                Rules
            </button>
            <span></span>
            <button 
           className="event-name disable-btn-transform"
           onClick={e => {
               var ele = document.getElementById(scrollId)
               console.log(ele?.scrollTop)
               if(ele){
                   ele.scrollTop = 0;
                   ele.scrollIntoView()
               }
           }}
           >
           ORDER OF CHAOS
           </button>
            <button
                className="disable-btn-transform"
                onClick={e => {
                    var ele = document.getElementById(scrollId)
                    console.log(ele?.scrollTop)
                    if(ele){
                        ele.scrollTop = 0;
                        ele.scrollIntoView()
                    }
                }}
            >
                
           <img src="/Logo.svg" alt="" 
           className="logo"
           /> 
           </button>
        </div>
    )
}

export default Navbar
