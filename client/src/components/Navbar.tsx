import React, {useContext} from "react";
import {AuthContext} from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";

const Navbar:React.FC = () => {
  const auth = useContext(AuthContext)
 


  return (
    <div>
      {auth.state.token ? (
        <div>
          <div>You are logged in </div>
          <button onClick={e => auth.dispatch({type : AuthActionTypes.LOGOUT, payload : []})}>Logout</button>
        </div>
      ) : (
        <div>Login dude</div>
      )}
    </div>
  );
};

export default Navbar;
