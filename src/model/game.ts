import {
  Board,
  BoardDTO,
  boardFromJSON,
  createBoard,
  jsonFromBoard,
} from "./board";
import { Marker } from "./marker";
import { Modifier, PlayerModifier } from "./modifier";
import { jsonFromPlayer, Player, PlayerDTO, playerFromJSON } from "./player";
import {
  createPrices,
  jsonFromPrices,
  Prices,
  PricesDTO,
  pricesFromJSON,
} from "./prices";
import { createTurn, jsonFromTurn, Turn, TurnDTO, turnFromJSON } from "./turn";
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

      case "crash":
        return false;

      case "payday":
        return false;
    }
  } else {
    return false;
  }
}

function actionModifier(modifier?: Modifier): PlayerModifier | false {
  if (modifier) {
    switch (modifier) {
      case "plus-1":
        return false;

      case "plus-2":
        return false;

      case "plus-3":
        return false;

      case "plus-5":
        return false;

      case "minus-1":
        return false;

      case "minus-2":
        return false;

      case "minus-3":
        return false;

      case "crash":
        return modifier;

      case "payday":
        return modifier;
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
    const { turn, board, prices, players } = state;
    const { state: turnState } = turn;

    if (turnState.player.id !== player.id) {
      return gameFromState(state);
    }

    if (turnState.marker == null) {
      return gameFromState(state);
    }

    const marker = turnState.marker;
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

    const price = updatedPrices.state[marker];

    const actionsUpate = actionModifier(modifier);
    const updatedPlayers =
      actionsUpate !== false
        ? players.map((p) => {
            switch (actionsUpate) {
              case "crash":
                return p.crash(marker, price.value);

              case "payday":
                return p.payday(marker, price.value);

              default:
                return p;
            }
          })
        : players;

    const updateMarkers = turnState.markers.slice(1);

    const updated: GameState = {
      ...state,
      board: updatedBoard,
      prices: updatedPrices,
      players: updatedPlayers,
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

export interface GameDTO {
  board: BoardDTO;
  prices: PricesDTO;
  players: PlayerDTO[];
  markers: Marker[];
  turn: TurnDTO;
}

export function gameFromJSON(json: GameDTO): Game {
  const state: GameState = {
    board: boardFromJSON(json.board),
    prices: pricesFromJSON(json.prices),
    players: json.players.map((p) => playerFromJSON(p)),
    markers: json.markers,
    turn: turnFromJSON(json.turn),
  };

  return {
    state: state,
    placeMarker: placeMarker(state),
    endTurn: endTurn(state),
  };
}

export function jsonFromGame(game: Game): GameDTO {
  return {
    board: jsonFromBoard(game.state.board),
    prices: jsonFromPrices(game.state.prices),
    players: game.state.players.map((p) => jsonFromPlayer(p)),
    markers: game.state.markers,
    turn: jsonFromTurn(game.state.turn),
  };
}
