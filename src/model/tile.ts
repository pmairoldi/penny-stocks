import { Marker } from "./marker";
import { Modifier } from "./modifier";

export interface DefaultTile {
  type: "default";
  row: number;
  column: number;
  marker: Marker | null;
}

export interface ModifierTile {
  type: "modifier";
  row: number;
  column: number;
  modifier: Modifier;
  marker: Marker | null;
}

export interface StartTile {
  type: "start";
  row: number;
  column: number;
  marker: Marker;
}

export type Tile = DefaultTile | ModifierTile | StartTile;
