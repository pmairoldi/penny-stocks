import { FC, useCallback, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useEventListener } from "../hooks";
import { GameLogEntryDTO, PlayerDTO } from "../../../server/shared/dto";
import { textForModifier } from "./util";

interface GameLogProps {
  players: PlayerDTO[];
  logs: GameLogEntryDTO[];
}

interface GameLogEntryProps {
  players: PlayerDTO[];
  log: GameLogEntryDTO;
}

const Dropdown = styled.div`
  position: relative;
`;

const DropdownToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: black;
  color: white;
  border-radius: 50%;
  border: 1px solid white;
  font-size: 1rem;
`;

const DropdownContent = styled.div`
  position: absolute;
  left: 58px;
  bottom: 25px;
  background: white;
  border: 1px solid black;
  overflow: auto;
  width: 260px;
  height: 260px;
  padding: 8px;

  > * ~ * {
    margin-top: 8px;
  }
`;

const GameLogEntry: FC<GameLogEntryProps & { className?: string }> = (
  props
) => {
  const { players, log, className } = props;

  const playerName = useMemo(() => {
    const player = players.find((p) => p.id === log.playerId);
    if (player != null) {
      return player.name;
    } else {
      return "Player";
    }
  }, [log, players]);

  const message = useMemo(() => {
    switch (log.event.type) {
      case "place-marker":
        return log.event.modifier == null
          ? `${playerName} placed a ${log.event.marker} marker.`
          : `${playerName} placed a ${
              log.event.marker
            } marker on ${textForModifier(log.event.modifier).toLowerCase()}.`;

      case "end-turn":
        return `${playerName} ended turn.`;

      case "buy":
        return `${playerName} bought ${log.event.marker}.`;

      case "sell":
        return `${playerName} sold ${log.event.marker}.`;
    }
  }, [log, playerName]);

  return <div className={className}>{message}</div>;
};

const StyledGameEntry = styled(GameLogEntry)`
  font-size: 0.8rem;
`;

export const GameLog: FC<GameLogProps> = (props) => {
  const { logs, players } = props;
  const [opened, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setOpen(!opened);
  }, [opened, setOpen]);

  const onOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (opened === false) {
        return;
      }

      const target = event.target as Node | null;

      if (toggleRef.current?.contains(target)) {
        return;
      }

      if (contentRef.current?.contains(target)) {
        return;
      }

      setOpen(!opened);
    },
    [toggleRef, contentRef, opened, setOpen]
  );

  useEventListener("click", onOutsideClick);

  return (
    <Dropdown>
      <DropdownToggle ref={toggleRef} onClick={toggleDropdown}>
        Logs
      </DropdownToggle>
      {opened === true ? (
        <DropdownContent ref={contentRef}>
          {logs.map((log) => {
            return (
              <StyledGameEntry
                key={log.timestamp}
                log={log}
                players={players}
              />
            );
          })}
        </DropdownContent>
      ) : null}
    </Dropdown>
  );
};
