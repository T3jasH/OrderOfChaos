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
      };
    default:
      return state;
  }
};
