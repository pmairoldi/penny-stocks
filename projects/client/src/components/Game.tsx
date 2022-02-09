import { FC, useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import {
  ActionDTO,
  GameDTO,
  GameLogEntryDTO,
  MarkerDTO,
  PlayerDTO,
} from "../../../server/shared/dto";
import useSoundEffect from "../hooks/useSoundEffect";
import { Board } from "./Board";
import { GameLog } from "./GameLog";
import { Player } from "./Player";
import { PlayersDropdown } from "./PlayersDropdown";
import { Price } from "./Price";
import { Turn } from "./Turn";

interface GameProps {
  me: PlayerDTO;
  game: GameDTO;
  logs: GameLogEntryDTO[];
  updateGame: (action: ActionDTO) => void;
}

const GameContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PlayContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const StyledBoard = styled(Board)`
  flex: 2;
  padding: 16px;
`;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 540px;
  padding: 16px;

  > * ~ * {
    margin-top: 8px;
  }
`;

const PricesContainer = styled.div`
  flex: 1;
  overflow: auto;

  > * ~ * {
    margin-top: 8px;
  }
`;

const PlayersContainer = styled.div`
  position: absolute;
  left: 16px;
  top: 16px;
`;

const MarkerCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: black;
  color: white;
  border-radius: 50%;
  border: 1px solid white;
`;

const InfoContainer = styled.div`
  position: absolute;
  left: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: column;

  > * ~ * {
    margin-top: 8px;
  }
`;

export const Game: FC<GameProps> = (props) => {
  const { me: sessionPlayer, game, logs, updateGame } = props;

  const playerTurnSound = useSoundEffect("/sounds/player-turn.m4a", {
    volume: 0.25,
    rate: 2.0,
  });

  const me = useMemo(() => {
    return game.players.find((p) => p.id === sessionPlayer.id);
  }, [sessionPlayer, game]);

  const prices = useMemo(() => {
    return game.prices;
  }, [game]);

  const players = useMemo(() => {
    return game.players;
  }, [game]);

  const turn = useMemo(() => {
    return game.turn;
  }, [game]);

  const isMyTurn = useMemo(() => {
    return turn != null && turn.playerId === me?.id;
  }, [turn, me]);

  useEffect(() => {
    if (isMyTurn) {
      playerTurnSound.play();
    } else {
      playerTurnSound.stop();
    }
  }, [playerTurnSound, isMyTurn]);

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
    (row: number, column: number) => {
      if (me != null) {
        updateGame({
          type: "place-marker",
          gameId: game.id,
          row: row,
          column: column,
        });
      }
    },
    [game, me, updateGame]
  );

  const endTurn = useCallback(() => {
    if (me != null) {
      updateGame({ type: "end-turn", gameId: game.id });
    }
  }, [game, me, updateGame]);

  const onBuy = useCallback(
    (marker: MarkerDTO) => {
      if (me != null) {
        updateGame({
          type: "buy",
          gameId: game.id,
          marker: marker,
        });
      }
    },
    [game, me, updateGame]
  );

  const onSell = useCallback(
    (marker: MarkerDTO) => {
      if (me != null) {
        updateGame({
          type: "sell",
          gameId: game.id,
          marker: marker,
        });
      }
    },
    [game, me, updateGame]
  );

  const canBuy = useMemo<{
    [price in MarkerDTO]: boolean;
  }>(() => {
    if (turn != null && turn.playerId === me?.id && turn.tradesRemaining > 0) {
      const money = me.money;
      const canBuy = (money: number, value: number) => {
        return value <= 0 ? true : money >= value;
      };
      return {
        blue: canBuy(money, prices.blue.value),
        purple: canBuy(money, prices.purple.value),
        red: canBuy(money, prices.red.value),
        yellow: canBuy(money, prices.yellow.value),
      };
    } else {
      return { blue: false, purple: false, red: false, yellow: false };
    }
  }, [turn, me, prices]);

  const canBuyBlue = useMemo(() => {
    return canBuy.blue;
  }, [canBuy]);

  const canBuyPurple = useMemo(() => {
    return canBuy.purple;
  }, [canBuy]);

  const canBuyRed = useMemo(() => {
    return canBuy.red;
  }, [canBuy]);

  const canBuyYellow = useMemo(() => {
    return canBuy.yellow;
  }, [canBuy]);

  const canSell = useMemo<{
    [price in MarkerDTO]: boolean;
  }>(() => {
    if (turn != null && turn.playerId === me?.id && turn.tradesRemaining > 0) {
      const stocks = me.stocks;
      return {
        blue: stocks.blue > 0,
        purple: stocks.purple > 0,
        red: stocks.red > 0,
        yellow: stocks.yellow > 0,
      };
    } else {
      return { blue: false, purple: false, red: false, yellow: false };
    }
  }, [turn, me]);

  const canSellBlue = useMemo(() => {
    return canSell.blue;
  }, [canSell]);

  const canSellPurple = useMemo(() => {
    return canSell.purple;
  }, [canSell]);

  const canSellRed = useMemo(() => {
    return canSell.red;
  }, [canSell]);

  const canSellYellow = useMemo(() => {
    return canSell.yellow;
  }, [canSell]);

  return (
    <GameContainer>
      <PlayContainer>
        <StyledBoard game={game} placeMarker={placeMarker} />

        <DataContainer>
          <PricesContainer>
            <Price
              marker="blue"
              price={bluePrice}
              onBuy={onBuy}
              onSell={onSell}
              canBuy={canBuyBlue}
              canSell={canSellBlue}
            />
            <Price
              marker="purple"
              price={purplePrice}
              onBuy={onBuy}
              onSell={onSell}
              canBuy={canBuyPurple}
              canSell={canSellPurple}
            />
            <Price
              marker="yellow"
              price={yellowPrice}
              onBuy={onBuy}
              onSell={onSell}
              canBuy={canBuyYellow}
              canSell={canSellYellow}
            />
            <Price
              marker="red"
              price={redPrice}
              onBuy={onBuy}
              onSell={onSell}
              canBuy={canBuyRed}
              canSell={canSellRed}
            />
          </PricesContainer>

          {me == null ? null : (
            <Player
              player={me}
              showMoney={true}
              active={me.id === turn?.playerId}
              turn={
                me?.id === turn?.playerId ? (
                  <Turn turn={turn} endTurn={endTurn} />
                ) : undefined
              }
            ></Player>
          )}
        </DataContainer>
        <InfoContainer>
          <GameLog players={game.players} logs={logs}></GameLog>
          <MarkerCount>{game.markers.length}</MarkerCount>
        </InfoContainer>
      </PlayContainer>
      <PlayersContainer>
        <PlayersDropdown>
          {players.map((player) => {
            const isActive = player.id === turn?.playerId;
            return (
              <Player
                key={player.id}
                player={player}
                showMoney={false}
                active={isActive}
              ></Player>
            );
          })}
        </PlayersDropdown>
      </PlayersContainer>
    </GameContainer>
  );
};
