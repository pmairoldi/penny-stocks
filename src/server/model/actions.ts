import { ActionDTO } from "../dto";
import { Marker } from "./marker";

export interface PlaceMarkerAction {
  type: "place-marker";
  playerId: string;
  row: number;
  column: number;
}

export interface BuyAction {
  type: "buy";
  playerId: string;
  marker: Marker;
}

export interface SellAction {
  type: "sell";
  playerId: string;
  marker: Marker;
}

export interface EndTurnAction {
  type: "end-turn";
  playerId: string;
}

export type Action = PlaceMarkerAction | BuyAction | SellAction | EndTurnAction;

export function actionFromJSON(json: ActionDTO, playerId: string): Action {
  switch (json.type) {
    case "place-marker":
      return {
        type: "place-marker",
        playerId: playerId,
        row: json.row,
        column: json.column,
      };

    case "buy":
      return {
        type: "buy",
        playerId: playerId,
        marker: json.marker,
      };

    case "sell":
      return {
        type: "sell",
        playerId: playerId,
        marker: json.marker,
      };

    case "end-turn":
      return {
        type: "end-turn",
        playerId: playerId,
      };
  }
}
