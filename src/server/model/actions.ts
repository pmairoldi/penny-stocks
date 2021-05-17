import { Marker } from "./marker";

export interface PlaceMarkerAction {
  type: "place-marker";
  gameId: string;
  playerId: string;
  row: number;
  column: number;
}

export interface BuyAction {
  type: "buy";
  gameId: string;
  playerId: string;
  marker: Marker;
}

export interface SellAction {
  type: "sell";
  gameId: string;
  playerId: string;
  marker: Marker;
}

export interface EndTurnAction {
  type: "end-turn";
  gameId: string;
  playerId: string;
}

export type Action = PlaceMarkerAction | BuyAction | SellAction | EndTurnAction;
