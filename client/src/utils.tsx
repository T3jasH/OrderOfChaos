import {AuthActionTypes } from "./context/AuthReducer";
import { attack, PlayerActionTypes } from "./context/PlayerReducer";
import { QuestionActionTypes } from "./context/QuestionReducer";
import {IleaderboardPlayer } from "./Pages/LeaderboardPage";
import React, { useContext } from "react"
import { AuthContext } from "./context/AuthContext";

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
      console.log("LOGGING CONTEST DATA:");
      console.log(data.data);

      questions.dispatch({
        type: QuestionActionTypes.GET_QUESTIONS,
        payload: data.data.questions,
      });
      auth.dispatch({
        type: AuthActionTypes.GET_AUTH,
        payload: {
          isStarted: true,
          isAdmin: data.data.user.isAdmin,
          id: data.data.user._id.toString(),
          username: data.data.user.username
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
    });
  
};



export const getUser = async (auth : any, player?: any) => {
  let resp=null;
  if(auth.state.token){
  resp = await fetch("/api/auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": auth.state.token,
    },
  })
  if(resp.status === 401){
    auth.dispatch({type : AuthActionTypes.LOGOUT, payload : []})
    return;
  }
  const data = await resp.json()
  if(data.success){
    auth.dispatch({type : AuthActionTypes.GET_AUTH, payload : {
      id : data.data.user._id,
      isAdmin : data.data.user.isAdmin,
      isStarted : true,
      username: data.data.user.username
    }})
    if(player){
      player.dispatch({ 
        type: PlayerActionTypes.GET_USER, 
        payload: {
        score: data.data.user.score,
        attacks: data.data.user.attackers,
        attacksLeft: data.data.user.remAttack
      }}
      )
    }
  }
  else{
    console.log(data)
  }
  return data;
}
  return {success : false}
}

export const getLeaderboard = async (auth: any) => {
  
  const resp = await fetch("/api/leaderboard", {
    method: "GET",
    headers: {
      "x-auth-token": auth.state.token,
      "Content-type": "application/json",
    },
  })
  if(resp.status === 401){
    auth.dispatch({type : AuthActionTypes.LOGOUT, payload: []})
    return ;
  }
  const data = await resp.json()
  return data.data
   
};

// To get count of attacks, from another player on current player 
export  const getAttackersCount = (attackers : attack[], leaderboardPlayer: any) => {
  let cnt = 0
  if(attackers.length){
    attackers.map( (attacker: attack) => {
      if(attacker.username === leaderboardPlayer.username){
        cnt += 1;
      }
      return null
    } )
  }
  return cnt;
}

export const sortAttackers = (leaderboardPlayers: IleaderboardPlayer[], auth : any) => {
  var att:any = null
  att = leaderboardPlayers?.find(player => player._id === auth.state.id )?.attackers
  att = att?.map((obj:any) => {
        let newObj = obj;
        newObj.date = Date.parse(obj.date);
        if(leaderboardPlayers?.length){
        var idx =  leaderboardPlayers?.findIndex(player => player.username === obj.username)
        newObj.rank = idx+1
        newObj.score = leaderboardPlayers[idx].score
        newObj._id = leaderboardPlayers[idx]._id
        newObj.numberOfAttacks = leaderboardPlayers[idx].attackers.length
       }
          return newObj
      })
      att?.sort((firstAttacker:any, secondAttacker:any) => 
      firstAttacker.date < secondAttacker.date ? 1 : -1
      )
      if(att){
      var newAtt:any = []
      var m = new Map()
      att.map((obj:any) => {
        if(!m.has(obj._id)){
          m.set(obj._id, obj.date)
          newAtt.push( att.find( (attacker:any) => attacker._id === obj._id && attacker.date === obj.date) )
        }
        return null
      })
      att = newAtt
      }
    return att? att : null
}

export const SendAlert:React.FC = () => {

    const auth  = useContext(AuthContext)
    
    if(auth.state.authAlertMessage)
    return <div className="status-container">
      {console.log(auth.state.alertMessageType)}
      <p className={`status-message ${auth.state.alertMessageType}`}
      >
        {auth.state.authAlertMessage}
      <i className='fas fa-times' 
      onClick={() => {
        auth.dispatch({type : AuthActionTypes.CLEAR_MESSAGE, payload : {}})
      }}></i>
      </p>
    </div>
    return <div/>
}

export const Loading:React.FC = () => {
  return <div 
  className="loading"
  >
    <div className="loader" />
    </div>
}