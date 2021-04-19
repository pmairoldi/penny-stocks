import { Board, createBoard } from "./board";
import { Marker } from "./marker";
import { Modifier } from "./modifier";
import { Player } from "./player";
import { createPrices, Prices } from "./prices";
import { createTurn, Turn } from "./turn";
import { shuffle } from "./utils";

interface GameState {
  board: Board;
  prices: Prices;
  players: Player[];
  markers: Marker[];
  turn: Turn;
}

export interface Game {
  state: GameState;
  placeMarker: (
    player: Player,
    row: number,
    column: number,
    modifier?: Modifier
  ) => Game;
  endTurn: (player: Player) => Game;
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

function createMarkers(): Marker[] {
  const createMarkersOfType = (marker: Marker) => {
    return new Array<Marker>(24).fill(marker);
  };

  return shuffle([
    ...createMarkersOfType("red"),
    ...createMarkersOfType("blue"),
    ...createMarkersOfType("purple"),
    ...createMarkersOfType("yellow"),
  ]);
}

export function createGame(
  players: Player[],
  onEnd: (state: GameState) => void
): Game {
  const { turn, markers } = createTurn(players[0], createMarkers())!;
  const state: GameState = {
    board: createBoard(),
    prices: createPrices(),
    players: players,
    markers: markers,
    turn: turn,
  };

  const placeMarker = (state: GameState) => {
    return (
      player: Player,
      row: number,
      column: number,
      modifier?: Modifier
    ): Game => {
      const { turn, board, prices } = state;
      if (turn.player.id !== player.id) {
        return {
          state: state,
          placeMarker: placeMarker(state),
          endTurn: endTurn(state),
        };
      }

      if (turn.marker == null) {
        onEnd(state);
        return {
          state: state,
          placeMarker: placeMarker(state),
          endTurn: endTurn(state),
        };
      }

      const updatedBoard = board.updateTile(row, column, (tile) => {
        switch (tile.type) {
          case "default":
            tile.marker = turn.marker;
            return tile;
          case "modifier":
            tile.marker = turn.marker;
            return tile;
          case "start":
            return tile;
        }
      });

      const pricesUpdate = pricesModifier(modifier);

      const updatedPrices =
        pricesUpdate !== false
          ? prices.updatePrice(turn.marker, pricesUpdate)
          : prices;

      const updateMarkers = turn.markers.slice(1);
      const updatedMarker = updateMarkers.length > 0 ? updateMarkers[0] : null;

      const updated: GameState = {
        ...state,
        board: updatedBoard,
        prices: updatedPrices,
        turn: { ...turn, markers: updateMarkers, marker: updatedMarker },
      };

      return {
        state: updated,
        placeMarker: placeMarker(updated),
        endTurn: endTurn(updated),
      };
    };
  };

  const endTurn = (state: GameState) => {
    return (player: Player): Game => {
      const { turn, players, markers } = state;
      if (turn.player.id !== player.id) {
        return {
          state: state,
          placeMarker: placeMarker(state),
          endTurn: endTurn(state),
        };
      }

      const playerIndex = players.findIndex((p) => p.id === player.id);

      const activePlayer =
        playerIndex === players.length - 1
          ? players[0]
          : players[playerIndex + 1];

      const next = createTurn(activePlayer, markers);

      if (next == null) {
        onEnd(state);
        return {
          state: state,
          placeMarker: placeMarker(state),
          endTurn: endTurn(state),
        };
      }

      const { turn: nextTurn, markers: nextMarkers } = next;
      const updated: GameState = {
        ...state,
        turn: nextTurn,
        markers: nextMarkers,
      };

      return {
        state: updated,
        placeMarker: placeMarker(updated),
        endTurn: endTurn(updated),
      };
    };
  };

  return {
    state: state,
    placeMarker: placeMarker(state),
    endTurn: endTurn(state),
  };
}
