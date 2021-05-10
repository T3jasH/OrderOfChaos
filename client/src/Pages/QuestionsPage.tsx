import React, { useContext, useEffect, useState } from "react";
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
  const [isLoading, setLoading] = useState<boolean>(true);

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
      setLoading(false);

      console.log("LOGGING QUESTION DATAK");
      console.log(questions.state);
    }
  }, [questions.state]);

  if (auth.state.token === "x") {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return <div>insert loading animation here</div>;
  }

  if (auth.state.token === "x") {
    return <Redirect to="/login" />;
  }

  return (
    <div className="questions-page">
      <div className="header">
        <button style={{ marginLeft: "5vw" }}>Order of Chaos</button>
        <button
          onClick={() => history.push("/leaderboard")}
          style={{ cursor: "default" }}
        >
          Score : {player.state.score}
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
        <button>Rules</button>
      </div>
      <div className="questions-container">
        {questions.state.map((item, index) => (
          <QuestionListItem question={item} />
        ))}
      </div>

      {player.state.attacks.length ? <AttackLog /> : null}
    </div>
  );
};

export default QuestionPage;
