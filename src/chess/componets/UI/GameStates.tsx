import { FC, useEffect } from "react";
import Message from "./Message";
import useChessGameStore from "../../../state/chess_store/game";
import usePlayerStore from "../../../state/chess_store/player";
import { useChessMainStore } from "../../../state/UserAndGameState";
import { socket } from "../../../socket/socket";

const GameStates: FC = () => {
  const { colorInCheck, colorInCheckMate, colorInStaleMate } = useChessGameStore();
  const { currentPlayer } = usePlayerStore();
  const { gameCondition } = useChessMainStore();

  // useEffect(() => {
   
    
  //   return () => {
  //     chann?.off()
  //   }
  // })

  return (
    <>
      {!colorInCheckMate && (
        <>
          {<Message text={`${currentPlayer} turn`}></Message>}
          {gameCondition && <Message text={gameCondition}></Message>}
          {colorInCheck && <Message text={`${colorInCheck} In Check`} />}
        </>
      )}
      {colorInCheckMate && <Message text={`${colorInCheckMate} Lose`} />}
      {colorInStaleMate && <Message text={`Stalemate to ${colorInStaleMate}`} />}
    </>
  );
};

export default GameStates;
