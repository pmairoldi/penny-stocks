import { FC, useCallback, useMemo } from "react";
import styled from "styled-components";
import { GameDTO, PlayerDTO, PricesDTO } from "../../../server/shared/dto";
import { LargeButton } from "./Button";

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

const GameOverPlayers = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #d4b483;
  width: 100%;
  max-height: 40vh;
  max-width: 400px;
  overflow: auto;

  > * ~ * {
    border-top: 1px solid #d4b483;
  }
`;

const GameOverPlayer = styled.div`
  display: flex;
  padding: 8px;
  background-color: #dccaaf;

  > * ~ * {
    margin-left: 8px;
  }
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

export const GameOver: FC<GameOverProps> = (props) => {
  const { game, me, onPlayAgain } = props;

  const playerScores = useMemo(() => {
    const { prices } = game;
    return game.players
      .map((p) => {
        return { id: p.id, name: p.name, score: score(p, prices) };
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
              <GameOverPlayerName>
                {p.id === me.id ? <>&#10148;</> : null}
                {p.name}
              </GameOverPlayerName>
              <GameOverPlayerScore>${p.score}</GameOverPlayerScore>
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
