import React, {useState} from "react"
import "../styles/RegisterPage.css"
import axios from "axios"

const RegisterPage: React.FC = () => {

    const [email, handleEmail] = useState<string>("")
    const [username, handleUsername] = useState<string>("")
    const [regno, handleRegno] = useState<string>("")
    const [password, handlePassword] = useState<string>("")
    const [name, handleName] = useState<string>("")
    const [phoneNo, handlePhoneNo] = useState<string>("")
    const [status, handleStatus] = useState<string | null>(null)

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const body = {
            email : email,
            name : name,
            regno : regno, 
            password : password,
            username : username,
            college : "MIT"
        } 
        // axios.post("/api/users", body)
        // .then(response => console.log(response))
        // .catch(err => console.log(err))
        fetch("/api/users", {
            method : "POST",
            body : JSON.stringify(body),
            headers : {
                "Content-Type" : "application/json"
            }
        })
        .then(res => res.json())
        .catch(err => console.log(err))
        .then(data => {
            if(data.errors){
                console.log(data.errors[0])
                handleStatus(data.errors[0].msg)
            }
            else if(data.success){
                handleStatus(data.msg)
            }
            else if(data.msg === "User already exists"){
                handleStatus(data.msg)
            }
            console.log(data)
        })
        
    }

    return <div className="register-page" >
        <div className="container">
            <h3>Register</h3>
            <form onSubmit={e => handleSubmit(e)}>
                <input type="text" placeholder="Username" name="username" onChange={e => handleUsername(e.target.value)} />
                <input type="text" placeholder="Name" name="name" onChange={e => handleName(e.target.value)} />
                <input type="text" placeholder="Email" name="email" onChange={e => handleEmail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => handlePassword(e.target.value)} />
                <input type="text" placeholder="Registration No" name="regno" onChange={e => handleRegno(e.target.value)} />
                <input type="text" placeholder="Phone No" name="phoneNo" onChange={e => handlePhoneNo(e.target.value)} />
                <input type="submit" value="submit" />
            </form>
            {status ? <b>{status}</b> : null}
        </div>
    </div>
}

export default RegisterPage