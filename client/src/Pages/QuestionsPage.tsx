import React, { useContext, useEffect} from "react";
import { QuestionContext } from "../context/QuestionContext";
import { AuthContext } from "../context/AuthContext";
import { Redirect, useHistory } from "react-router";
import { getContestDetails } from "../utils";
import "../styles/QuestionsPage.css";
import { AuthActionTypes } from "../context/AuthReducer";
import QuestionListItem from "../components/QuestionListItem";
import { PlayerContext } from "../context/PlayerContext";
import AttackLog from "../components/AttackLog";
const QuestionPage: React.FC = () => {
  const questions = useContext(QuestionContext);
  const auth = useContext(AuthContext);
  const player = useContext(PlayerContext);
  const history = useHistory();

  useEffect(() => {
    if (auth.state.token === null) {
      auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] });
    }
  });

  useEffect(() => {
    if (auth.state.token !== null && auth.state.token !== "x")
      getContestDetails(auth, questions, player);
  }, [auth.state.token]);

  useEffect(() => {
    if (questions.state[0]) {
      auth.dispatch({type : AuthActionTypes.SET_LOADING, payload : []})
    }
  }, [questions.state]);

  if (auth.state.token === "x") {
    return <Redirect to="/login" />;
  }

  console.log(auth.state.token);

  if (auth.state.loading) {
    return <div>insert loading animation here</div>;
  }

  if (auth.state.token === "x") {
    return <Redirect to="/login" />;
  }

  return (
    <div className="questions-page">
      <div className="header">
        <button style={{ marginLeft: "2vw" }}>Order of Chaos</button>
        <button
          onClick={() => history.push("/leaderboard")}
          style={{ cursor: "default" }}
        >
          Score : {player.state.score}
        </button>
        <button>
          Attacks Left : {player.state.attacksLeft}
        </button>
        <button onClick={() => history.push("/leaderboard")}>
          Leaderboard
        </button>
        <button
          onClick={(e) => {
            auth.dispatch({ type: AuthActionTypes.LOGOUT, payload: [] });
            history.push("/login");
          }}
        >
          Logout
        </button>
        <button onClick={e => {
          history.push("/rules")
        }}>
          Rules
        </button>

        {console.log(auth.state, questions.state)}
      </div>
      <div className="questions-container">
        {questions.state.map((item, index) => (
          <QuestionListItem question={item} />
        ))}
      </div>

      <AttackLog />
    </div>
  );
};

export default QuestionPage;
