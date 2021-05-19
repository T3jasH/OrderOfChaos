import React from "react"
import { useHistory } from "react-router"
import "../styles/Rules.css"

const RulesPage : React.FC = ( ) => {
    const history = useHistory()

    return <div className="rules">
        <div className="rules-container">
        <h2>RULES</h2>
            <ol className="rules-list">
            <li>
                This is an induvidual player contest
            </li>
            <li>
                Registrations close on (date). Participants can log in after (date).
            </li>
            <li>
                Participants are required to save their code for all submissions, and can be asked to send it at the end of the contest.
            </li>
            <li>
                Once the contest starts, participants must make all submissions from the same device. This is to prevent cheating.
            </li>
            <li>
                Initially you have 200 points, and all questions are locked. You are to unlock questions using these 200 points.
            </li>
            <li>
                There is no limit on attempts on a question, but for every wrong submission, you lose points. Penalty depends on the level 
                of difficulty of the question.
            </li>
            <li>
                A correct submission on first attempt on an easy question gives you an attack to use on another player. Similarly for a medium 
                question you get an attack for a correct submission in one of the first 2 attempts, and for a hard question on one of the first 3 attempts.
            </li>
            <li>
                You can select a player to attack from the leaderboard or attacker's list. 
            </li>
            </ol>   
            <button
            onClick={() => history.goBack()}
            >
            {`<Back`}    
            </button> 
        </div>
    </div>
}

export default RulesPage