import React, {useContext} from "react";
import { useHistory } from "react-router";
import {AuthContext} from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";
import "../styles/NavBar.css"

const Navbar:React.FC = () => {
  const auth = useContext(AuthContext)
  const history = useHistory()


  return <div className="navbar">
  <button
    style={{marginRight : "10vw"}}
    id="logout-btn"
    className="btn-nav"
    onClick={(e) => {
      auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] });
      history.push("/login");
    }}
  >
    Logout
  </button>
  <button onClick={() => history.push("/leaderboard")} className="btn-nav" >
    Leaderboard
  </button>
  <button 
  className="btn-nav"
  onClick={e => {
    history.push("/rules")
  }}>
    Rules
  </button>
 

  
</div>

};

export default Navbar;
