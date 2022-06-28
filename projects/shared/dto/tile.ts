import { PlacedMarkerDTO } from "./marker";
import { ModifierDTO } from "./modifier";

export interface DefaultTileDTO {
  type: "default";
  row: number;
  column: number;
  marker: PlacedMarkerDTO | null;
}

export interface ModifierTileDTO {
  type: "modifier";
  row: number;
  column: number;
  modifier: ModifierDTO;
  marker: PlacedMarkerDTO | null;
}

export interface StartTileDTO {
  type: "start";
  row: number;
  column: number;
  marker: PlacedMarkerDTO;
}

export type TileDTO = DefaultTileDTO | ModifierTileDTO | StartTileDTO;
