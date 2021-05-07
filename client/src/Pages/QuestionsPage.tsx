import React, {useContext, useEffect, useState} from "react"
import {QuestionContext} from "../context/QuestionContext"
import {AuthContext} from "../context/Auth"
import {Redirect} from "react-router"
import {getContestDetails} from "../utils"

const QuestionPage : React.FC = () => {
    const questions = useContext(QuestionContext)
    const auth = useContext(AuthContext)
    const [isLoading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        getContestDetails(auth)
    })
    
    return <div>
        Questions
    </div>
}

export default QuestionPage;
