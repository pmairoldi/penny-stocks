import { FC, useCallback, useMemo } from "react";
import { Modifier } from "../model";
import { Game } from "../model/game";
import "./Board.css";
import { DefaultTile, ModifierTile, StartTile } from "./Tile";

interface BoardProps {
  game: Game;
  placeMarker: (row: number, column: number, modifier?: Modifier) => void;
}

export const Board: FC<BoardProps> = (props) => {
  const { game, placeMarker } = props;

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
    <div className="Board">
      {board.state.rows.map((row, index) => {
        return (
          <div className="Board-row" key={`row-${index}`}>
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
          </div>
        );
      })}
    </div>
  );
};
