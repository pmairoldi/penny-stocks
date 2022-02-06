import { PlacedMarker } from "./marker";
import { Modifier } from "./modifier";

export interface DefaultTile {
  type: "default";
  row: number;
  column: number;
  marker: PlacedMarker | null;
}

export interface ModifierTile {
  type: "modifier";
  row: number;
  column: number;
  modifier: Modifier;
  marker: PlacedMarker | null;
}

export interface StartTile {
  type: "start";
  row: number;
  column: number;
  marker: PlacedMarker;
}

export type Tile = DefaultTile | ModifierTile | StartTile;
