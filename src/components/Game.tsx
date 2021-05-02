import { FC, useCallback, useMemo } from "react";
import styled from "styled-components";
import {
  Game as GameModel,
  Marker as MarkerModel,
  Modifier,
  Player as PlayerModel,
} from "../server/model";
import { Board } from "./Board";
import { Player } from "./Player";
import { PlayersDropdown } from "./PlayersDropdown";
import { Price } from "./Price";
import { Turn } from "./Turn";

interface GameProps {
  me: PlayerModel;
  game: GameModel;
  updateGame: (game: GameModel) => void;
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
  position: absolute;
  left: 16px;
  bottom: 16px;
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

const GameOver = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const GameOverTitle = styled.div`
  font-size: 6rem;
  font-weight: bold;
  color: #c1666b;
  text-align: center;
`;

const GameOverPlayers = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameOverPlayer = styled.div``;

export const Game: FC<GameProps> = (props) => {
  const { me: sessionPlayer, game, updateGame } = props;

  const me = useMemo(() => {
    return game.state.players.find((p) => p.id === sessionPlayer.id);
  }, [sessionPlayer, game]);

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

  const canBuy = useMemo<
    {
      [price in MarkerModel]: boolean;
    }
  >(() => {
    if (turn.state.playerId === me?.id && turn.state.tradesRemaining > 0) {
      const money = me.state.money;
      return {
        blue: money >= prices.blue.value,
        purple: money >= prices.purple.value,
        red: money >= prices.red.value,
        yellow: money >= prices.yellow.value,
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

  const canSell = useMemo<
    {
      [price in MarkerModel]: boolean;
    }
  >(() => {
    if (turn.state.playerId === me?.id && turn.state.tradesRemaining > 0) {
      const stocks = me.state.stocks;
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

  const isGameOver = useMemo(() => {
    return game.state.gameover;
  }, [game]);

  const playerScores = useMemo(() => {
    return game.state.players.map((p) => {
      const { prices } = game.state;
      return { id: p.id, name: p.name, score: p.score(prices) };
    });
  }, [game]);

  return (
    <GameContainer>
      {isGameOver ? (
        <GameOver>
          <GameOverTitle>Game Over</GameOverTitle>
          <GameOverPlayers>
            {playerScores.map((p) => {
              return (
                <GameOverPlayer key={p.id}>
                  {p.name}: ${p.score}
                </GameOverPlayer>
              );
            })}
          </GameOverPlayers>
        </GameOver>
      ) : (
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
                turn={
                  me?.id === turn.state.playerId ? (
                    <Turn turn={turn} endTurn={endTurn} />
                  ) : undefined
                }
              ></Player>
            )}
          </DataContainer>
          <MarkerCount>{game.state.markers.length}</MarkerCount>
        </PlayContainer>
      )}
      <PlayersContainer>
        <PlayersDropdown>
          {players.map((player) => {
            const isActive = player.id === turn.state.playerId;
            return (
              <Player
                key={player.id}
                player={player}
                active={isActive}
              ></Player>
            );
          })}
        </PlayersDropdown>
      </PlayersContainer>
    </GameContainer>
  );
};
