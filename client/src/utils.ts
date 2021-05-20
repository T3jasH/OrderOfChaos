import {AuthActionTypes } from "./context/AuthReducer";
import { attack, PlayerActionTypes } from "./context/PlayerReducer";
import { QuestionActionTypes } from "./context/QuestionReducer";
import { Iattacker, IleaderboardPlayer } from "./Pages/LeaderboardPage";

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
    console.log(data)
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
  const data = await resp.json()
  //console.log(data.data.attackers)
  return data.data
   
};


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
  var att = null
  att = leaderboardPlayers?.find(player => player._id === auth.state.id)?.attackers
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
      firstAttacker.date < secondAttacker.date ? 1 : 0
      )
      if(att){
      var toDelete = []
      for(var i=0; i<att?.length-1; i++){
          if(att[i].username === att[i+1].username){
              toDelete.push(i+1)
          }
      }
      for(i=0; i<toDelete.length; i++){
          att.splice(toDelete[i]-i, 1)
      }
    }
    return att? att : undefined
}