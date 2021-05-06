import { useState, useEffect } from "react";
import { IUser, Nullable } from "../context/AuthContext";

const useLocalStorageState = (key: string, defaultVal: Nullable<IUser>) => {
  const [state, setState] = useState(() => {
    let value;

    try {
      value = JSON.parse(
        window.localStorage.getItem(key) || String(defaultVal)
      );
    } catch (e) {
      value = defaultVal;
    }

    return value;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
};

export default useLocalStorageState;
