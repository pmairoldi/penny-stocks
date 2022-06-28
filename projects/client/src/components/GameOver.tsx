import { FC, Fragment, useCallback, useMemo } from "react";
import styled from "styled-components";
import { GameDTO, MarkerDTO, PlayerDTO, PricesDTO } from "@penny-stocks/shared";
import { LargeButton } from "./Button";
import { HSpacer, HStack, VSpacer, VStack } from "./layouts";
import { Marker } from "./Marker";

interface GameOverProps {
  me: PlayerDTO;
  game: GameDTO;
  onPlayAgain?: (id: string) => void;
}

const GameOverContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * ~ * {
    margin-top: 16px;
  }
`;

const GameOverTitle = styled.div`
  font-size: 6rem;
  font-weight: bold;
  color: #c1666b;
  text-align: center;
`;

const GameOverPlayers = styled(VStack)`
  border: 2px solid #d4b483;
  width: 100%;
  max-height: 40vh;
  max-width: 400px;
  overflow: auto;

  > * ~ * {
    border-top: 1px solid #d4b483;
  }
`;

const GameOverPlayer = styled(VStack)`
  width: 100%;
  padding: 8px;
  background-color: #dccaaf;
`;

const GameOverPlayerName = styled.div`
  flex: 1;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GameOverPlayerScore = styled.div`
  flex: none;
`;

const PlayerMarker = styled(Marker)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
`;

export const GameOver: FC<GameOverProps> = (props) => {
  const { game, me, onPlayAgain } = props;

  const playerScores = useMemo(() => {
    const { prices } = game;
    return game.players
      .map((p) => {
        return { ...p, score: score(p, prices) };
      })
      .sort((a, b) => {
        if (a.score > b.score) {
          return -1;
        } else if (a.score < b.score) {
          return 1;
        } else {
          return 0;
        }
      });
  }, [game]);

  const playAgain = useCallback(() => {
    if (onPlayAgain != null) {
      onPlayAgain(game.id);
    }
  }, [game, onPlayAgain]);

  return (
    <GameOverContainer>
      <GameOverTitle>Game Over</GameOverTitle>
      <GameOverPlayers>
        {playerScores.map((p) => {
          return (
            <GameOverPlayer key={p.id}>
              <HStack style={{ width: "100%" }}>
                <GameOverPlayerName>
                  {p.id === me.id ? <>&#10148;</> : null}
                  {p.name}
                </GameOverPlayerName>
                <HSpacer min={10}></HSpacer>
                <GameOverPlayerScore>${p.score}</GameOverPlayerScore>
              </HStack>
              <VSpacer min={10} max={10}></VSpacer>
              <HStack style={{ width: "100%" }}>
                {Object.entries(p.stocks).map(([key, value], index, array) => {
                  return (
                    <Fragment key={key}>
                      <PlayerMarker marker={key as MarkerDTO}>
                        {value}
                      </PlayerMarker>
                      {index !== array.length - 1 ? (
                        <HSpacer min={10}></HSpacer>
                      ) : null}
                    </Fragment>
                  );
                })}
              </HStack>
            </GameOverPlayer>
          );
        })}
      </GameOverPlayers>
      {onPlayAgain != null ? (
        <LargeButton onClick={playAgain}>Play again</LargeButton>
      ) : null}
    </GameOverContainer>
  );
};

function score(player: PlayerDTO, prices: PricesDTO): number {
  const { money, stocks } = player;

  const remaining =
    prices.blue.value * stocks.blue +
    prices.red.value * stocks.red +
    prices.yellow.value * stocks.yellow +
    prices.purple.value * stocks.purple;

  return money + remaining;
}
