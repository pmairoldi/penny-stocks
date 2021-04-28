import React, { FC, useCallback, useMemo } from "react";
import { Marker as MarkerModel, Modifier } from "../server/model";
import { Marker } from "./Marker";
import "./Tile.css";

interface DefaultTileProps {
  row: number;
  column: number;
  marker: MarkerModel | null;
  onClick: (row: number, column: number) => void;
}

export const DefaultTile: FC<DefaultTileProps> = (props) => {
  const { row, column, marker, onClick: clickHandler } = props;

  const disabled = useMemo(() => {
    return marker != null;
  }, [marker]);

  const onClick = useCallback(() => {
    clickHandler(row, column);
  }, [row, column, clickHandler]);

  return (
    <button className="Tile DefaultTile" onClick={onClick} disabled={disabled}>
      {marker != null ? <Marker marker={marker} /> : null}
    </button>
  );
};

interface ModifierTileProps {
  row: number;
  column: number;
  modifier: Modifier;
  marker: MarkerModel | null;
  onClick: (row: number, column: number, modifer: Modifier) => void;
}

export const ModifierTile: FC<ModifierTileProps> = (props) => {
  const { row, column, modifier, marker, onClick: clickHandler } = props;

  const disabled = useMemo(() => {
    return marker != null;
  }, [marker]);

  const onClick = useCallback(() => {
    clickHandler(row, column, modifier);
  }, [row, column, modifier, clickHandler]);

  return (
    <button className="Tile ModifierTile" onClick={onClick} disabled={disabled}>
      <div className="ModifierTile-modifer">{modifier}</div>
      {marker != null ? <Marker marker={marker} /> : null}
    </button>
  );
};

interface StartTileProps {
  row: number;
  column: number;
  marker: MarkerModel;
}

export const StartTile: FC<StartTileProps> = (props) => {
  const { marker } = props;

  const className = useMemo(() => {
    return `Tile StartTile StartTile-${marker}`;
  }, [marker]);

  return <div className={className}>Start</div>;
};
