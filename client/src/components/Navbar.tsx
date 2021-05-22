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
        </div>
    )
}

export default Navbar
