import userEvent from "@testing-library/user-event";
import { LeanDocument } from "mongoose";
import react, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";
import { getUser } from "../utils";

import { PlayerContext } from "../context/PlayerContext";
import { PlayerActionTypes, playerReducer } from "../context/PlayerReducer";
import LeaderboardHeader from "../components/LeaderboardHeader";

export interface IleaderboardPlayers {
  username: string;
  _id: string;
  score: number;
  attackers: Iattacker[];
}

export interface Iattacker {
  seen: boolean;
  username: string;
  date: string;
  _id: string;
}
const LeaderboardPage = () => {
  const auth = useContext(AuthContext);
  const contextPlayer = useContext(PlayerContext);

  const [leaderboardPlayers, setLeaderboardPlayers] = useState<
    IleaderboardPlayers[]
  >();
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true);

  useEffect(() => {
    if (auth.state.token === null) {
      auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] });
    }
  });

  useEffect(() => {
    if (auth.state.token !== null && auth.state.token !== "x") {
      getLeaderboard(auth);
      if (auth.state.id == "") {
        getUser(auth, contextPlayer);
      }
    }
  }, [auth.state.token]);

  console.log(contextPlayer);

  const getLeaderboard = (auth: any) => {
    fetch("/api/leaderboard", {
      method: "GET",
      headers: {
        "x-auth-token": auth.state.token,
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log({ data });
        setLeaderboardPlayers(data.data.ranks);
        setLeaderboardLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const handleAttack = (id: string) => {
    if (contextPlayer.state.attacksLeft <= 0) {
      alert("You don't have any attacks!");
      return;
    }

    if (auth.state.token) {
      fetch("/api/leaderboard/id", {
        method: "POST",
        headers: {
          "x-auth-token": auth.state.token,
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          contextPlayer.dispatch({
            type: PlayerActionTypes.UPDATE_ATTACKS_LEFT,
            payload: contextPlayer.state.attacksLeft - 1,
          });
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <div>
      {leaderboardLoading ? (
        <div>loading....</div>
      ) : (
        <div>
          <LeaderboardHeader />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {leaderboardPlayers?.map((player) => (
              <div
                style={{
                  display: "flex",
                  width: "50%",
                  margin: "auto",
                  padding: "10px",
                  backgroundColor:
                    player._id === auth.state.id ? "yellow" : "pink",
                }}
              >
                <div style={{ width: "300px" }}>{player.username}</div>
                <div style={{ width: "300px" }}>{player.score}</div>
                <div style={{ width: "300px" }}>{player.attackers.length}</div>
                {player._id !== auth.state.id && (
                  <button
                    style={{ backgroundColor: "cyan" }}
                    onClick={() => handleAttack(player._id)}
                  >
                    Attack
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default LeaderboardPage;
