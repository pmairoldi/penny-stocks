import { FC, useEffect, useMemo, useState } from "react";
import "./App.css";
import { Board } from "./components";
import { Price } from "./components";
import { createGame } from "./model/game";
import { createPlayer } from "./model/player";

const App: FC = () => {
  const [game, updateGame] = useState(createGame());

  useEffect(() => {
    updateGame((game) => {
      return game
        .addPlayer(createPlayer("test-1", "Test User 1"))
        .addPlayer(createPlayer("test-2", "Test User 2"));
    });
  }, [updateGame]);

  const prices = useMemo(() => {
    return game.state.prices;
  }, [game]);

  const players = useMemo(() => {
    return game.state.players;
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

      <div className="Players">
        {players.map((player) => {
          return (
            <div className="Player" key={player.id}>
              {player.name}: {player.state.value},{" "}
              {player.state.markers.join(",")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
