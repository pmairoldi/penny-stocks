import { FC, useCallback, useMemo, useState } from "react";
import "./App.css";
import { Board, Price } from "./components";
import { Modifier } from "./model";
import { createGame } from "./model/game";
import { createPlayer } from "./model/player";

const App: FC = () => {
  const [game, updateGame] = useState(
    createGame(
      [
        createPlayer("test-1", "Test User 1"),
        createPlayer("test-2", "Test User 2"),
      ],
      (state) => {
        console.log("ENDED", state);
      }
    )
  );

  const me = useMemo(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("id");
    return game.state.players.find((p) => p.id === id);
  }, [game]);

  const prices = useMemo(() => {
    return game.state.prices;
  }, [game]);

  const players = useMemo(() => {
    return game.state.players;
  }, [game]);

  const turn = useMemo(() => {
    return game.state.turn;
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

  const placeMarker = useCallback(
    (row: number, column: number, modifier?: Modifier) => {
      if (me != null) {
        updateGame(game.placeMarker(me, row, column, modifier));
      }
    },
    [game, me, updateGame]
  );

  const endTurn = useCallback(() => {
    if (me != null) {
      updateGame(game.endTurn(me));
    }
  }, [game, me, updateGame]);

  return (
    <div className="App">
      <Board game={game} placeMarker={placeMarker} />

      <div className="Prices">
        <Price marker="blue" price={bluePrice} />
        <Price marker="purple" price={purplePrice} />
        <Price marker="yellow" price={yellowPrice} />
        <Price marker="red" price={redPrice} />
      </div>

      <div className="Players">
        {players.map((player) => {
          const isActive = player.id === turn.player.id;
          return (
            <div
              className={isActive ? "Player Player-active" : "Player"}
              key={player.id}
            >
              {player.name}: {player.state.money},{" "}
              {JSON.stringify(player.state.stocks)}
            </div>
          );
        })}
      </div>

      <div className="Turn">
        {JSON.stringify(turn)}
        <button
          className="EndTurn"
          disabled={turn.player.id !== me?.id}
          onClick={endTurn}
        >
          End Turn
        </button>
      </div>
    </div>
  );
};

export default App;
