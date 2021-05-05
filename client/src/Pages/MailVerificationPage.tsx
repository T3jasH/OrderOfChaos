import React, {useState, useEffect} from "react"
import {useParams, useHistory} from "react-router"

const MailVerificationPage : React.FC  = () => {

    const [message, setMessage] = useState<string>("")

    const {token} : any = useParams()

    const history = useHistory()


    useEffect(
        () => {
            if(token)
            fetch(`confirmation/${token}`, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            .then(res => res.json())
            .catch(err => console.log(err))
            .then(data => {
                if(data.success){
                    setMessage(data.msg)
                    setTimeout(()=> {
                        history.push("/login")
                    }, 3000)
                }
                else{
                    setMessage(data.msg)
                }
            })
        },
        [token]
    )
    

    return <div>
        {message} 
    </div>
}

export default MailVerificationPage