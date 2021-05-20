import React, { useContext, useEffect, useState } from "react"
import { QuestionContext } from "../context/QuestionContext"
import { AuthContext } from "../context/AuthContext"
import { Redirect, useHistory } from "react-router"
import { getContestDetails, getLeaderboard } from "../utils"
import "../styles/QuestionsPage.css"
import { AuthActionTypes } from "../context/AuthReducer"
import QuestionListItem from "../components/QuestionListItem"
import { PlayerContext } from "../context/PlayerContext"
import Navbar from "../components/Navbar"
import PlayerInfoFooter from "../components/PlayerInfoFooter"
const QuestionPage: React.FC = () => {
    const questions = useContext(QuestionContext)
    const auth = useContext(AuthContext)
    const player = useContext(PlayerContext)
    const [rank, setRank] = useState<number | null>(null)

    useEffect(() => {
        if (auth.state.token === null) {
            auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] })
        }
    })

    useEffect(() => {
        if (auth.state.token !== null && auth.state.token !== "x")
            getContestDetails(auth, questions, player)
    }, [auth.state.token])

  useEffect( () => {
    if(auth?.state?.id?.length ){
      getLeaderboard(auth)
      .then(data => {
        console.log(data.attackers)
        setRank(
          data.ranks.findIndex((user:any) => user._id === auth.state.id) + 1
        )
      })
    }
  }, [auth.state.id])

  useEffect(() => {
    if (questions?.state?.length && rank !== null) {
      auth.dispatch({type : AuthActionTypes.SET_LOADING, payload : []})
    }
  }, [questions.state, rank]);

    if (auth.state.token === "x") {
        return <Redirect to="/login" />
    }

    if (auth.state.loading) {
        return <div>insert loading animation here</div>
    }

  if (auth.state.loading) {
    return <div>insert loading animation here</div>;
  }

  if(!auth.state.isStarted){
    return <Redirect to="/rules" />
  }
  
  return (
    <div className="questions-page"  >
      <Navbar/>
      <h2 className="mobile-message" >Switch to PC for a better experience</h2>
      <div className="questions-container">
        <h3>QUESTIONS</h3>
      {questions.state.map((item, index) => (
        <QuestionListItem question={item} index={index} key={item.name}/>
        ))}
      </div>
      <PlayerInfoFooter
      active={false}
      rank={rank}
      />
    </div>
  );
};

export default QuestionPage
