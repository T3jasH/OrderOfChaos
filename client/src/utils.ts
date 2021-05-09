import { AuthActionTypes } from "./context/AuthReducer";
import { PlayerActionTypes } from "./context/PlayerReducer";
import { QuestionActionTypes } from "./context/QuestionReducer";

export const getContestDetails = async (
  auth: any,
  questions: any,
  player: any
) => {
  fetch("/api/contest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": auth.state.token,
    },
  })
    .then((resp) => {
      if (resp.status === 401) {
        auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] });
      }
      return resp.json();
    })
    .catch((err) => console.log(err))
    .then((data) => {
      if (!data.success) {
        return;
      }
      console.log("LOGGING AUTH DATA:");
      console.log(data.data.user._id);

      questions.dispatch({
        type: QuestionActionTypes.GET_QUESTIONS,
        payload: data.data.questions,
      });
      auth.dispatch({
        type: AuthActionTypes.GET_TOKEN,
        payload: {
          isStarted: true,
          isAdmin: data.data.user.isAdmin,
          _id: data.data.user._id.toString(),
        },
      });
      player.dispatch({
        type: PlayerActionTypes.GET_USER,
        payload: {
          score: data.data.user.score,
          attacks: data.data.user.attackers,
          attacksLeft: data.data.user.remAttack,
        },
      });
      console.log("FETCHED CONTEST DETAILS");
      console.log(data.data.user.attackers);
    });
};
