import React, {
  useEffect,
  useContext,
  useState,
  TextareaHTMLAttributes,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { AuthActionTypes } from "../context/AuthReducer";

import { PlayerContext } from "../context/PlayerContext";

import { useParams } from "react-router-dom";
import { getUser } from "../utils";
import { playerReducer } from "../context/PlayerReducer";

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
  const [loading, setLoading] = useState<boolean>(true);
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
          setLoading(false);
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
      getUser(auth, player);
    }
  });

  const { id }: any = useParams();
  const markdown = "<b> Play bold </b>";

  // const handleAnswerSubmit = (e: React.FormEvent<TextareaHTMLAttributes>)

  if (loading) return <div>loading...</div>;
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

      <form>
        <textarea
          cols={30}
          rows={10}
          onChange={(e) => setUserAnswer(e.target.value)}
        >
          Put your output here
        </textarea>
      </form>
    </div>
  );
};
export default QuestionPage;
