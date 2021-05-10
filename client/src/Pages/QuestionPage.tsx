import React, {
  useEffect,
  useContext,
  useState,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";
import { PlayerContext } from "../context/PlayerContext";
import { useParams } from "react-router-dom";
import { getUser } from "../utils";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

export interface IQuestion {
  constraints: string;
  inpFormat: string;
  name: string;
  outFormat: string;
  penalty: number;
  points: number;
  quesId: number;
  samInput: string;
  samOutput: string;
  statement: string;
  tags: string[];
  testcase: string;
  unlockCost: number;
  _id: string;
}

const QuestionPage = () => {
  const auth = useContext(AuthContext);
  const player = useContext(PlayerContext);

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [questionData, setQuestionData] = useState<IQuestion | null>(null);

  const [submitMessage, setSubmitMessage] = useState<string>("");
  useEffect(() => {
    console.log("LOGGING AUTH");
    console.log(auth);
    console.log(auth.state.token);
    console.log("IS THIS GETTING CALLED");
    if (auth.state.token) {
      fetch(`/api/question/${id}`, {
        method: "GET",
        headers: {
          "x-auth-token": auth.state.token,
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("printing data:");
          setQuestionData(data.data.question);
          console.log(typeof questionData?.statement);
          auth.dispatch({type : AuthActionTypes.SET_LOADING, payload : []})
          console.log(data);
        })
        .catch((e) => {
          console.log(e);

          console.log("Am i getting an error");
        });
    }
  }, [auth.state.token]);

  useEffect(() => {
    if (auth.state.token === null) {
      auth.dispatch({ type: AuthActionTypes.GET_TOKEN, payload: [] });
      getUser(auth);
    }
  });

  const { id }: any = useParams();
  const markdown = "<b> Play bold </b>";

  const handleAnswerSubmit = () => {
    if (auth.state.token) {
      fetch(`/api/question/${id}`, {
        method: "POST",
        headers: {
          "x-auth-token": auth.state.token,
          "Content-type": "application/json",
        },

        body: JSON.stringify({ answer: userAnswer }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("printing data:");
          console.log(data);
          setSubmitMessage(data.msg);
        })
        .catch((e) => {
          console.log(e);

          console.log("Am i getting an error");
        });
    }
  };

  if (auth.state.loading) return <div>loading...</div>;
  return (
    <div>
      <h1>Solve please</h1>
      <h1>{questionData?.name}</h1>
      {questionData?.statement && (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {questionData?.statement}
        </ReactMarkdown>
        // <ReactMarkdown rehypePlugins={[rehypeRaw]}>{markdown}</ReactMarkdown>
      )}

      <textarea
        cols={30}
        rows={10}
        onChange={(e) => setUserAnswer(e.target.value)}
      >
        Put your output here
      </textarea>
      <button style={{ backgroundColor: "cyan" }} onClick={handleAnswerSubmit}>
        Submit Wisely
      </button>
      {submitMessage !== "" && <div>{submitMessage}</div>}
    </div>
  );
};
export default QuestionPage;
