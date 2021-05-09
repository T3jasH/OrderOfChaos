import { LeanDocument } from "mongoose";
import react, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";

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

  const [leaderboardPlayers, setLeaderboardPlayers] = useState<
    IleaderboardPlayers[]
  >();
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(true);

  const getLeaderboard = (auth: any) => {
    fetch("/api/leaderboard", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "x-auth-token": auth.state.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLeaderboardPlayers(data.data.ranks);
        setLeaderboardLoading(false);
        console.log("bruh");
        console.log(auth.state);
        console.log({ data });
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (auth.state.token === null) {
      auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] });
    }
  });

  useEffect(() => {
    if (auth.state.token !== null && auth.state.token !== "x")
      getLeaderboard(auth);
  }, [auth.state.token]);

  const handleAttack = () => {
    console.log("lmao");
  };

  return (
    <div>
      {leaderboardLoading ? (
        <div>loading....</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {leaderboardPlayers?.map((player: IleaderboardPlayers) => (
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
              {player._id !== auth.state.id && (
                <button
                  style={{ backgroundColor: "cyan" }}
                  onClick={handleAttack}
                >
                  Attack
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default LeaderboardPage;
