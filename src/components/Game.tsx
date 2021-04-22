import { FC, useCallback, useMemo } from "react";
import { Game as GameModel, Modifier, Player } from "../model";
import { Board } from "./Board";
import "./Game.css";
import { Price } from "./Price";

interface GameProps {
  me: Player;
  game: GameModel;
  updateGame: (game: GameModel) => void;
}

export const Game: FC<GameProps> = (props) => {
  const { me, game, updateGame } = props;

  const prices = useMemo(() => {
    return game.state.prices.state;
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

  const endTurnDisabled = useMemo(() => {
    if (turn.state.player.id === me?.id) {
      return !turn.canEnd();
    } else {
      return true;
    }
  }, [turn, me]);

  const endTurn = useCallback(() => {
    if (me != null) {
      updateGame(game.endTurn(me));
    }
  }, [game, me, updateGame]);

  return (
    <div className="Game">
      <Board game={game} placeMarker={placeMarker} />

      <div className="Prices">
        <Price marker="blue" price={bluePrice} />
        <Price marker="purple" price={purplePrice} />
        <Price marker="yellow" price={yellowPrice} />
        <Price marker="red" price={redPrice} />
      </div>

      <div className="Players">
        {players.map((player) => {
          const isActive = player.id === turn.state.player.id;
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
          disabled={endTurnDisabled}
          onClick={endTurn}
        >
          End Turn
        </button>
      </div>
    </div>
  );
};
