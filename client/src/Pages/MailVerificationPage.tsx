import React, { useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";
import "../styles/LoginPage.css"

const MailVerificationPage: React.FC = () => {
  const { token }: any = useParams();
  const auth = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (token)
      fetch(`/api/users/confirmation/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .catch((err) => console.log(err))
        .then((data) => {
          auth.dispatch({type : AuthActionTypes.SET_MESSAGE, payload : {msg: data.msg}})
          history.push("/login")
        });
  }, [token]);

  return <div className="login-page">
    </div>;
};

export default MailVerificationPage;
