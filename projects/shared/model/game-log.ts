import { GameLogEventDTO } from "../dto";
import { Action } from "./actions";
import { Game } from "./game";
import { Tile } from "./tile";

function placeMarkeLog(tile: Tile): GameLogEventDTO | null {
  switch (tile.type) {
    case "default":
      return tile.marker == null
        ? null
        : { type: "place-marker", marker: tile.marker };

    case "modifier":
      return tile.marker == null
        ? null
        : {
            type: "place-marker",
            marker: tile.marker,
            modifier: tile.modifier,
          };

    case "start":
      return null;
  }
}

export function gameLogFromAction(
  action: Action,
  game: Game
): GameLogEventDTO | null {
  switch (action.type) {
    case "place-marker":
      const tile = game.state.board.tileAt(action.row, action.column);
      return placeMarkeLog(tile);

    case "end-turn":
      return { type: "end-turn" };

    case "buy":
      return { type: "buy", marker: action.marker };

    case "sell":
      return { type: "sell", marker: action.marker };
  }
}
