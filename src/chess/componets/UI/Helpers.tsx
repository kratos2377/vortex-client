import { useChessMainStore } from "../../../state/UserAndGameState";

const Helpers = () => {
  const { helpers, toggleHelpers } = useChessMainStore();
  return (
    <label className="helpers" htmlFor="helpers">
      <input onChange={() => toggleHelpers(!helpers)} checked={helpers} id="helpers" type="checkbox"></input>
      Enable help
    </label>
  );
};

export default Helpers;
