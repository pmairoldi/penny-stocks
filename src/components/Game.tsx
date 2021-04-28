import { FC, useCallback, useMemo } from "react";
import {
  Game as GameModel,
  Marker as MarkerModel,
  Modifier,
  Player,
} from "../model";
import { Board } from "./Board";
import "./Game.css";
import { Marker } from "./Marker";
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
        updateGame(game.placeMarker(me.id, row, column, modifier));
      }
    },
    [game, me, updateGame]
  );

  const endTurnDisabled = useMemo(() => {
    if (turn.state.playerId === me?.id) {
      return !turn.canEnd();
    } else {
      return true;
    }
  }, [turn, me]);

  const endTurn = useCallback(() => {
    if (me != null) {
      updateGame(game.endTurn(me.id));
    }
  }, [game, me, updateGame]);

  const onBuy = useCallback(
    (marker: MarkerModel) => {
      if (me != null) {
        updateGame(game.buyStock(me.id, marker));
      }
    },
    [game, me, updateGame]
  );

  const onSell = useCallback(
    (marker: MarkerModel) => {
      if (me != null) {
        updateGame(game.sellStock(me.id, marker));
      }
    },
    [game, me, updateGame]
  );

  return (
    <div className="Game">
      <Board game={game} placeMarker={placeMarker} />

      <div className="Prices">
        <Price marker="blue" price={bluePrice} onBuy={onBuy} onSell={onSell} />
        <Price
          marker="purple"
          price={purplePrice}
          onBuy={onBuy}
          onSell={onSell}
        />
        <Price
          marker="yellow"
          price={yellowPrice}
          onBuy={onBuy}
          onSell={onSell}
        />
        <Price marker="red" price={redPrice} onBuy={onBuy} onSell={onSell} />
      </div>

      <div className="Players">
        {players.map((player) => {
          const isActive = player.id === turn.state.playerId;
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
        {me.id === turn.state.playerId ? (
          <>
            <span className="Trades">Trades:{turn.state.tradesRemaining}</span>
            {turn.state.markers.map((m, index) => {
              return <Marker key={`${m}-${index}`} marker={m} />;
            })}
          </>
        ) : null}
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
