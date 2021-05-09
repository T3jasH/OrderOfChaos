export interface Auth {
  token: string | null;
  isAdmin: boolean;
  isStarted: boolean;
  id: string;
}

export enum AuthActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  GET_TOKEN = "GET_TOKEN",
  GET_AUTH = "GET_AUTH",
}

export interface AuthAction {
  type: AuthActionTypes;
  payload: any;
}

export const authReducer = (state: Auth, action: AuthAction) => {
  console.log("Why is this not printing bruhhhhh");
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("iecseOrderOfChaosUser", action.payload.token);
      console.log("LOOK HERE");
      console.log(action.payload);
      return {
        token: action.payload.token,
        isAdmin: action.payload.isAdmin,
        id: action.payload._id,
        isStarted: true,
      };
    case "LOGOUT":
      localStorage.removeItem("iecseOrderOfChaosUser");
      return {
        ...state,
        token: null,
      };
    case "GET_TOKEN":
      let token = localStorage.getItem("iecseOrderOfChaosUser");
      if (token === null) {
        token = "x";
      }
      return {
        ...state,
        token: token,
      };
    case "GET_AUTH":
      return {
        token: localStorage.getItem("iecseOrderOfChaos"),
        isAdmin: action.payload.isAdmin,
        isStarted: action.payload.isStarted,
        id: action.payload._id,
      };
    default:
      return state;
  }
};
