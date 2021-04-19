import { Board, boardFromJSON, createBoard } from "./board";
import { Marker } from "./marker";
import { Modifier } from "./modifier";
import { Player } from "./player";
import { createPrices, Prices, pricesFromJSON } from "./prices";
import { createTurn, Turn, turnFromJSON } from "./turn";
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

const placeMarker = (state: GameState) => {
  return (
    player: Player,
    row: number,
    column: number,
    modifier?: Modifier
  ): Game => {
    const { turn, board, prices } = state;
    const { state: turnState } = turn;

    if (turnState.player.id !== player.id) {
      return gameFromState(state);
    }

    if (turnState.marker == null) {
      return gameFromState(state);
    }

    const updatedBoard = board.updateTile(row, column, (tile) => {
      switch (tile.type) {
        case "default":
          tile.marker = turnState.marker;
          return tile;
        case "modifier":
          tile.marker = turnState.marker;
          return tile;
        case "start":
          return tile;
      }
    });

    const pricesUpdate = pricesModifier(modifier);

    const updatedPrices =
      pricesUpdate !== false
        ? prices.updatePrice(turnState.marker, pricesUpdate)
        : prices;

    const updateMarkers = turnState.markers.slice(1);

    const updated: GameState = {
      ...state,
      board: updatedBoard,
      prices: updatedPrices,
      turn: turn.updateMarker(updateMarkers),
    };

    return gameFromState(updated);
  };
};

const endTurn = (state: GameState) => {
  return (player: Player): Game => {
    const { turn, players, markers } = state;
    if (turn.state.player.id !== player.id) {
      return gameFromState(state);
    }

    const playerIndex = players.findIndex((p) => p.id === player.id);

    const activePlayer =
      playerIndex === players.length - 1
        ? players[0]
        : players[playerIndex + 1];

    const next = createTurn(activePlayer, markers);

    if (next == null) {
      return gameFromState(state);
    }

    const { turn: nextTurn, markers: nextMarkers } = next;
    const updated: GameState = {
      ...state,
      turn: nextTurn,
      markers: nextMarkers,
    };

    return gameFromState(updated);
  };
};

export function createGame(players: Player[]): Game {
  const { turn, markers } = createTurn(players[0], createMarkers())!;
  const state: GameState = {
    board: createBoard(),
    prices: createPrices(),
    players: players,
    markers: markers,
    turn: turn,
  };

  return gameFromState(state);
}

export function gameFromState(state: GameState): Game {
  return {
    state: state,
    placeMarker: placeMarker(state),
    endTurn: endTurn(state),
  };
}

export function gameFromJSON(json: { [key: string]: any }): Game {
  const state: GameState = {
    board: boardFromJSON(json.board),
    prices: pricesFromJSON(json.prices),
    players: json.players,
    markers: json.markers,
    turn: turnFromJSON(json.turn),
  };

  return {
    state: state,
    placeMarker: placeMarker(state),
    endTurn: endTurn(state),
  };
}
