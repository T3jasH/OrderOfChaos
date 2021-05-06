import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const value = useAuth();
  const user = value?.currentUser;
  const logout = value?.logout;

  const handleLogout = () => {
    if (logout) logout();
  };

  return (
    <div>
      {user ? (
        <div>
          <div>You are logged in </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>Login dude</div>
      )}
    </div>
  );
};

export default Navbar;
