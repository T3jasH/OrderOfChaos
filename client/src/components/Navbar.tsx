import React, { useContext } from "react"
import { useHistory } from "react-router"
import { AuthContext } from "../context/AuthContext"
import { AuthActionTypes } from "../context/AuthReducer"
import "../styles/NavBar.css"

interface props {
    removeButton: boolean
}

const Navbar: React.FC<props> = ({ removeButton }) => {
    const auth = useContext(AuthContext)
    const history = useHistory()

    return (
        <div className="navbar">
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
                onClick={(e) => {
                    history.push("/")
                }}
                className='event-name'
            >
                
            
            <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="plus"
                className="svg-inline--fa fa-plus fa-w-14"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{ marginLeft: removeButton ? "5vw" : "10vw" }}
            >
                <path
                    fill="currentColor"
                    d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
                ></path>
            </svg>ORDER OF CHAOS</button>
        </div>
    )
}

export default Navbar
