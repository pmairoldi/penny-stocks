import { MarkerDTO } from "./marker";
import { ModifierDTO } from "./modifier";

export interface PlayeMarkerGameLogEventDTO {
  type: "place-marker";
  marker: MarkerDTO;
  modifier?: ModifierDTO;
}

export interface BuyGameLogEventDTO {
  type: "buy";
  marker: MarkerDTO;
}

export interface SellGameLogEventDTO {
  type: "sell";
  marker: MarkerDTO;
}

export interface EndTurnGameLogEventDTO {
  type: "end-turn";
}

export type GameLogEventDTO =
  | PlayeMarkerGameLogEventDTO
  | BuyGameLogEventDTO
  | SellGameLogEventDTO
  | EndTurnGameLogEventDTO;

export interface GameLogEntryDTO {
  timestamp: string;
  playerId: string;
  event: GameLogEventDTO;
}
