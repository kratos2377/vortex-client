import { FC, FormEvent, useState } from "react"
//@ts-ignore
import validateFEN from "fen-validator";
import useBoardStore from "../../../state/chess_store/board";
import { useChessMainStore } from "../../../state/UserAndGameState";

const FenInput: FC = () => {
  const { startGameFromFen } = useBoardStore();
  const { setGameCondition } = useChessMainStore();
  const [fenText, setFentext] = useState("");

  const formSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateFEN(fenText)) {
      startGameFromFen(fenText);
      setFentext("");
    } else {
      setGameCondition("invalid FEN char");
      setTimeout(() => setGameCondition(""), 3000);
    }
    // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1";
  };
  return (
    <form className="fen-form" onSubmit={(e) => formSubmit(e)}>
      <input
        value={fenText}
        onChange={(e) => setFentext(e.target.value)}
        type="text"
        placeholder="set FEN notation"
      ></input>
      <button type="submit">Start</button>
      <button onClick={() => setFentext("")} type="button">
        X
      </button>
    </form>
  );
};

export default FenInput;
