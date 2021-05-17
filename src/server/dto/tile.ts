import { MarkerDTO } from "./marker";
import { ModifierDTO } from "./modifier";

export interface DefaultTileDTO {
  type: "default";
  row: number;
  column: number;
  marker: MarkerDTO | null;
}

export interface ModifierTileDTO {
  type: "modifier";
  row: number;
  column: number;
  modifier: ModifierDTO;
  marker: MarkerDTO | null;
}

export interface StartTileDTO {
  type: "start";
  row: number;
  column: number;
  marker: MarkerDTO;
}

export type TileDTO = DefaultTileDTO | ModifierTileDTO | StartTileDTO;
