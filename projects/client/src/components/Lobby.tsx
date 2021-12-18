import { FC, useCallback, useMemo } from "react";
import styled from "styled-components";
import { GameDTO } from "../../../server/shared/dto";
import { LargeButton } from "./Button";

interface LobbyProps {
  game: GameDTO;
  onStart?: (id: string) => void;
}

const LobbyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  > * ~ * {
    margin-top: 16px;
  }
`;

const PlayerContainer = styled.div`
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

const Player = styled.div`
  padding: 8px;
  background-color: #dccaaf;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  font-size: 6rem;
  font-weight: bold;
  color: #c1666b;
  text-align: center;
`;

export const Lobby: FC<LobbyProps & { className?: string }> = (props) => {
  const { game, onStart } = props;

  const players = useMemo(() => {
    return game.players;
  }, [game]);

  const start = useCallback(() => {
    if (onStart != null) {
      onStart(game.id);
    }
  }, [game, onStart]);

  return (
    <LobbyContainer>
      <Header>Players</Header>
      <PlayerContainer>
        {players.map((p) => {
          return <Player key={p.id}>{p.name}</Player>;
        })}
      </PlayerContainer>
      {onStart != null ? (
        <ButtonContainer>
          <LargeButton onClick={start}>Start</LargeButton>
        </ButtonContainer>
      ) : null}
    </LobbyContainer>
  );
};
