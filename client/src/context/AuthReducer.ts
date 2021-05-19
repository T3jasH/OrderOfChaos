export interface Auth {
  token: string | null;
  isAdmin: boolean;
  isStarted: boolean;
  id: string;
  loading: boolean
  username: string
}

export enum AuthActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  GET_TOKEN = "GET_TOKEN",
  GET_AUTH = "GET_AUTH",
  SET_LOADING = "SET_LOADING"
}

export interface AuthAction {
  type: AuthActionTypes;
  payload: any;
}

export const authReducer = (state: Auth, action: AuthAction) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("iecseOrderOfChaosUser", action.payload.token);
      return {
        ...state, 
        token : action.payload.token
      };
    case "LOGOUT":
      localStorage.removeItem("iecseOrderOfChaosUser");
      return {
        ...state,
        token: "x",
      };
    case "GET_TOKEN":
      let token = localStorage.getItem("iecseOrderOfChaosUser");
      if (token === null) {
        token = "x";
        localStorage.removeItem("iecseOrderOfChaosUser")
      }
      return {
        ...state,
        token: token,
      };
    case "GET_AUTH":
      return {
        ...state,
        isAdmin: action.payload.isAdmin,
        isStarted: action.payload.isStarted,
        id: action.payload.id,
        username: action.payload.username
      };
    case "SET_LOADING":
      return {
        ...state, 
        loading : false
      }
    default:
      return state;
  }
};
