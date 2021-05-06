import React, { useState, useContext, ReactElement } from "react";
import useLocalStorageState from "../hooks/useLocalStorage";

export type Nullable<T> = T | null;

export interface IUser {
  token: string;
}

interface Props {
  children: ReactElement;
}

export interface Value {
  currentUser: Nullable<IUser>;
  setCurrentUser: any;
  register: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = React.createContext<Nullable<Value>>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export default function AuthProvider({ children }: Props): ReactElement {
  const [currentUser, setCurrentUser] = useLocalStorageState(
    "iecseshortcodeuser",
    null
  );

  const register = async (email: string, password: string) => {};

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
      credentials: "include",
    });

    const data = await response.json();
    if (data.success === true) {
      setCurrentUser({ token: data.token });
      return data;
    }
    return data;
  };

  const logout = async () => {
    localStorage.removeItem("iecseshortcodeuser");

    setCurrentUser(null);
  };

  const value: Value = {
    currentUser,
    setCurrentUser,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
