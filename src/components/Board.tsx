import React, { FC, useCallback, useMemo, useRef } from "react";
import styled from "styled-components";
import { useScale } from "../hooks";
import { Modifier } from "../server/model";
import { Game } from "../server/model/game";
import { DefaultTile, ModifierTile, StartTile } from "./Tile";

interface BoardProps {
  game: Game;
  placeMarker: (row: number, column: number, modifier?: Modifier) => void;
}

const BoardContainer = styled.div<{ scale: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  > * ~ * {
    margin-top: 8px;
  }

  position: relative;
  transform-origin: center center;
  transform: ${(props) => (props.scale < 1 ? `scale(${props.scale})` : null)};
`;

const BoardRow = styled.div`
  display: flex;
  flex-direction: row;

  > * ~ * {
    margin-left: 8px;
  }
`;

export const Board: FC<BoardProps & { className?: string }> = (props) => {
  const { className, game, placeMarker } = props;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const scale = useScale(876, 972, contentRef.current);

  const state = useMemo(() => {
    return game.state;
  }, [game]);

  const board = useMemo(() => {
    return state.board;
  }, [state]);

  const onTileClick = useCallback(
    (row: number, column: number, modifier?: Modifier) => {
      placeMarker(row, column, modifier);
    },
    [placeMarker]
  );

  return (
    <BoardContainer className={className} ref={contentRef} scale={scale}>
      {board.state.rows.map((row, index) => {
        return (
          <BoardRow key={`row-${index}`}>
            {row.map((tile) => {
              switch (tile.type) {
                case "default":
                  return (
                    <DefaultTile
                      key={`tile-${tile.row}-${tile.column}`}
                      row={tile.row}
                      column={tile.column}
                      marker={tile.marker}
                      onClick={onTileClick}
                    />
                  );
                case "modifier":
                  return (
                    <ModifierTile
                      key={`tile-${tile.row}-${tile.column}`}
                      row={tile.row}
                      column={tile.column}
                      marker={tile.marker}
                      modifier={tile.modifier}
                      onClick={onTileClick}
                    />
                  );
                case "start":
                  return (
                    <StartTile
                      key={`tile-${tile.row}-${tile.column}`}
                      row={tile.row}
                      column={tile.column}
                      marker={tile.marker}
                    />
                  );
                default:
                  return null;
              }
            })}
          </BoardRow>
        );
      })}
    </BoardContainer>
  );
};
