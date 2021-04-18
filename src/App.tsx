import { FC, useMemo, useState } from "react";
import "./App.css";
import { Board } from "./components";
import { Price } from "./components";
import { createGame } from "./model/game";

const App: FC = () => {
  const [game, updateGame] = useState(createGame());

  const prices = useMemo(() => {
    return game.state.prices;
  }, [game]);

  const bluePrice = useMemo(() => {
    return prices.blue;
  }, [prices]);

  const purplePrice = useMemo(() => {
    return prices.purple;
  }, [prices]);

  const yellowPrice = useMemo(() => {
    return prices.yellow;
  }, [prices]);

  const redPrice = useMemo(() => {
    return prices.red;
  }, [prices]);

  return (
    <div className="App">
      <Board game={game} updateGame={updateGame} />
      <div className="Prices">
        <Price marker="blue" price={bluePrice} />
        <Price marker="purple" price={purplePrice} />
        <Price marker="yellow" price={yellowPrice} />
        <Price marker="red" price={redPrice} />
      </div>
    </div>
  );
};

export default App;
