import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";
import { getUser } from "../utils";
import { PlayerContext } from "../context/PlayerContext";
import { PlayerActionTypes } from "../context/PlayerReducer";
import {getLeaderboard} from "../utils"
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
  useEffect(() => {
    if (auth.state.token === null) {
      auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] });
    }
  });

  useEffect(() => {
    if (auth.state.token !== null && auth.state.token !== "x") {
      getLeaderboard(auth)
      .then(data =>{
        setLeaderboardPlayers(data)
      })
      getUser(auth);
    }
  }, [auth.state.token]);   
  
  useEffect(() => {
    if(leaderboardPlayers?.length){
      auth.dispatch({type : AuthActionTypes.SET_LOADING, payload : []})
    }
  }, [leaderboardPlayers])

  const scroll = () => {
    if(window.location.hash){
      console.log(String(window.location.hash).substring(1, String(window.location.hash).length))
      document.getElementById(String(window.location.hash).substring(1, String(window.location.hash).length))?.scrollIntoView({behavior : "smooth"})
    }
  }

  const handleAttack = (id: string) => {
    if (contextPlayer.state.attacksLeft <= 0) {
      alert("You don't have any attacks!");
      return;
    }

    if (auth.state.token) {
      console.log("Is this getting called");
      fetch(`/api/leaderboard/${id}`, {
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
          getLeaderboard(auth)
          .then(data => {
            setLeaderboardPlayers(data)
          })
        })
        .catch((e) => console.log(e));
    }
  };
  console.log(leaderboardPlayers)
  return (
    <div>
      {auth.state.loading ? (
        <div>loading....</div>
      ) : (
        <div>
          {
            scroll()
          }
          <LeaderboardHeader />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {leaderboardPlayers?.map((player) => {
              return <div
                style={{
                  display: "flex",
                  width: "50%",
                  margin: "auto",
                  padding: "10px",
                  backgroundColor:
                    player._id === auth.state.id ? "yellow" : "pink",
                }}
              >
                <div style={{ width: "300px" }} id={player._id} >{player.username}</div>
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
              })}
          </div>
        </div>
      )}
    </div>
  );
};
export default LeaderboardPage;
