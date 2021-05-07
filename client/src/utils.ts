
export const getContestDetails = async (auth : any) => {
    console.log(auth)
    if(auth.state.token === null){
        auth?.dispatch({type : "GET_TOKEN", payload : []});
    }
    console.log(auth.state.token)
    fetch("/api/contest", {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            "x-auth-token" : auth.state.token
        }
    })
    .then(resp => resp.json())
    .catch(err => console.log(err))
    .then(data => {
        console.log(data)
    })
}