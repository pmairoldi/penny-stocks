import { MarkerDTO } from "./marker";

export interface PlaceMarkerActionDTO {
  type: "place-marker";
  gameId: string;
  row: number;
  column: number;
}

export interface BuyActionDTO {
  type: "buy";
  gameId: string;
  marker: MarkerDTO;
}

export interface SellActionDTO {
  type: "sell";
  gameId: string;
  marker: MarkerDTO;
}

export interface EndTurnActionDTO {
  type: "end-turn";
  gameId: string;
}

export type ActionDTO =
  | PlaceMarkerActionDTO
  | BuyActionDTO
  | SellActionDTO
  | EndTurnActionDTO;
