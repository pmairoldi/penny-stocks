import { Board, createBoard } from "./board";
import { Marker } from "./marker";
import { Modifier } from "./modifier";
import { createPrices, Prices } from "./prices";

interface GameState {
  board: Board;
  prices: Prices;
}

export interface Game {
  state: GameState;
  setMarker: (
    row: number,
    column: number,
    marker: Marker,
    modifier?: Modifier
  ) => Game;
}

function pricesModifier(modifier?: Modifier): number | false {
  if (modifier) {
    switch (modifier) {
      case "plus-1":
        return 1;

      case "plus-2":
        return 2;

      case "plus-3":
        return 3;

      case "plus-5":
        return 5;

      case "minus-1":
        return -1;

      case "minus-2":
        return -2;

      case "minus-3":
        return -3;

      case "illness":
        return false;

      case "payday":
        return false;
    }
  } else {
    return false;
  }
}

export function createGame(): Game {
  const state: GameState = {
    board: createBoard(),
    prices: createPrices(),
  };

  const setMarker = (state: GameState) => {
    return (
      row: number,
      column: number,
      marker: Marker,
      modifier?: Modifier
    ): Game => {
      const { board, prices } = state;

      const updatedBoard = board.updateTile(row, column, (tile) => {
        switch (tile.type) {
          case "default":
            tile.marker = marker;
            return tile;
          case "modifier":
            tile.marker = marker;
            return tile;
          case "start":
            return tile;
        }
      });

      const pricesUpdate = pricesModifier(modifier);

      const updatedPrices =
        pricesUpdate !== false
          ? prices.updatePrice(marker, pricesUpdate)
          : prices;

      const updated = { ...state, board: updatedBoard, prices: updatedPrices };
      return {
        state: updated,
        setMarker: setMarker(updated),
      };
    };
  };

  return {
    state: state,
    setMarker: setMarker(state),
  };
}
