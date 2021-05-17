import { GameDTO } from "../dto";
import { Action } from "./actions";
import { Board, boardFromJSON, createBoard, jsonFromBoard } from "./board";
import { Marker } from "./marker";
import { Modifier, PlayerModifier } from "./modifier";
import { jsonFromPlayer, Player, playerFromJSON } from "./player";
import { createPrices, jsonFromPrices, Prices, pricesFromJSON } from "./prices";
import { createTurn, jsonFromTurn, Turn, turnFromJSON } from "./turn";
import { shuffle } from "./utils";

interface GameState {
  id: string;
  board: Board;
  prices: Prices;
  players: Player[];
  markers: Marker[];
  turn: Turn | null;
  state: "created" | "in-progress" | "gameover";
}

export interface Game {
  state: GameState;
  id: string;
  applyAction: (action: Action) => Game;
  addPlayer: (player: Player) => Game;
  removePlayer: (player: Player) => Game;
  start: () => Game;
  restart: () => Game;
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

function getModifierFor(
  board: Board,
  row: number,
  column: number
): Modifier | undefined {
  const tile = board.tileAt(row, column);
  switch (tile.type) {
    case "modifier":
      return tile.modifier;
    default:
      return undefined;
  }
}

const placeMarker = (state: GameState) => {
  return (playerId: string, row: number, column: number): Game => {
    const { turn, board, prices, players } = state;
    if (turn == null) {
      return gameFromState(state);
    }

    const { state: turnState } = turn;

    if (turnState.playerId !== playerId) {
      return gameFromState(state);
    }

    if (turnState.marker == null) {
      return gameFromState(state);
    }

    const marker = turnState.marker;
    if (!board.canPlaceMarker(row, column, marker)) {
      return gameFromState(state);
    }

    const modifier = getModifierFor(board, row, column);
    const updatedBoard = board.setMarker(row, column, marker);

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

    if (!updatedBoard.hasActionTilesRemaining()) {
      const updated: GameState = {
        ...state,
        board: updatedBoard,
        prices: updatedPrices,
        players: updatedPlayers,
        turn: turn.updateMarker(updateMarkers),
        state: "gameover",
      };

      return gameFromState(updated);
    } else {
      const updated: GameState = {
        ...state,
        board: updatedBoard,
        prices: updatedPrices,
        players: updatedPlayers,
        turn: turn.updateMarker(updateMarkers),
      };

      return gameFromState(updated);
    }
  };
};

const endTurn = (state: GameState) => {
  return (playerId: string): Game => {
    const { turn, players, markers } = state;

    if (turn == null || turn.state.playerId !== playerId) {
      return gameFromState(state);
    }

    const playerIndex = players.findIndex((p) => p.id === playerId);

    const activePlayer =
      playerIndex === players.length - 1
        ? players[0]
        : players[playerIndex + 1];

    const next = createTurn(activePlayer, markers);
    const { turn: nextTurn, markers: nextMarkers } = next;

    if (nextMarkers.length === 0) {
      const updated: GameState = {
        ...state,
        state: "gameover",
      };
      return gameFromState(updated);
    } else {
      const updated: GameState = {
        ...state,
        turn: nextTurn,
        markers: nextMarkers,
      };

      return gameFromState(updated);
    }
  };
};

const buyStock = (state: GameState) => {
  return (playerId: string, marker: Marker): Game => {
    const { turn, players } = state;

    if (turn == null || turn.state.playerId !== playerId) {
      return gameFromState(state);
    }

    if (!turn.canMakeTrade()) {
      return gameFromState(state);
    }

    const player = players.find((p) => p.id === playerId);
    if (player == null) {
      return gameFromState(state);
    }

    const { prices } = state;
    const price = prices.state[marker];
    if (player.state.money < price.value) {
      return gameFromState(state);
    }

    const updatedPlayers = players.map((p) => {
      if (p.id === turn.state.playerId) {
        return p.buy(marker, price.value);
      } else {
        return p;
      }
    });

    const updated = {
      ...state,
      players: updatedPlayers,
      turn: turn.makeTrade(),
    };

    return gameFromState(updated);
  };
};

const sellStock = (state: GameState) => {
  return (playerId: string, marker: Marker): Game => {
    const { turn, players } = state;

    if (turn == null || turn.state.playerId !== playerId) {
      return gameFromState(state);
    }

    if (!turn.canMakeTrade()) {
      return gameFromState(state);
    }

    const player = players.find((p) => p.id === playerId);
    if (player == null) {
      return gameFromState(state);
    }

    const { prices } = state;
    const price = prices.state[marker];

    if (player.state.stocks[marker] < 1) {
      return gameFromState(state);
    }

    const updatedPlayers = players.map((p) => {
      if (p.id === turn.state.playerId) {
        return p.sell(marker, price.value);
      } else {
        return p;
      }
    });

    const updated = {
      ...state,
      players: updatedPlayers,
      turn: turn.makeTrade(),
    };

    return gameFromState(updated);
  };
};

const applyAction = (state: GameState) => {
  return (action: Action) => {
    switch (action.type) {
      case "place-marker":
        return placeMarker(state)(action.playerId, action.row, action.column);

      case "end-turn":
        return endTurn(state)(action.playerId);

      case "buy":
        return buyStock(state)(action.playerId, action.marker);

      case "sell":
        return sellStock(state)(action.playerId, action.marker);
    }
  };
};

const addPlayer = (state: GameState) => {
  return (player: Player): Game => {
    const { players } = state;

    const found = players.findIndex((p) => p.id === player.id);
    if (found !== -1) {
      return gameFromState(state);
    } else {
      const updated: GameState = {
        ...state,
        players: players.concat(player),
      };
      return gameFromState(updated);
    }
  };
};

const removePlayer = (state: GameState) => {
  return (player: Player): Game => {
    const { players, turn, markers } = state;

    const index = players.findIndex((p) => p.id === player.id);

    if (turn != null && turn.state.playerId === player.id) {
      const updatedMarkers =
        turn.state.playerId === player.id
          ? markers.concat(turn.state.markers)
          : markers;

      const nextPlayer =
        index + 1 >= players.length ? players[0] : players[index + 1];

      const updatedTurn = createTurn(nextPlayer, updatedMarkers);
      const updated: GameState = {
        ...state,
        players: players.filter((p) => p.id !== player.id),
        turn: updatedTurn.turn,
        markers: updatedTurn.markers,
      };

      return gameFromState(updated);
    } else {
      const updated: GameState = {
        ...state,
        players: players.filter((p) => p.id !== player.id),
      };

      return gameFromState(updated);
    }
  };
};

const start = (state: GameState) => {
  return (): Game => {
    const { players } = state;
    if (players.length === 0) {
      return gameFromState(state);
    }

    const randomizedPlayers = shuffle(players);
    const startingPlayer = randomizedPlayers[0];
    const { turn, markers } = createTurn(startingPlayer, createMarkers())!;

    const updatedState: GameState = {
      ...state,
      players: players,
      turn: turn,
      markers: markers,
      state: "in-progress",
    };

    return gameFromState(updatedState);
  };
};

const restart = (state: GameState) => {
  return (): Game => {
    const { id, players } = state;

    let updated = createGame(id);

    players.forEach((p) => {
      updated = updated.addPlayer(p);
    });

    return updated.start();
  };
};

export function createGame(id: string): Game {
  const state: GameState = {
    id: id,
    board: createBoard(),
    prices: createPrices(),
    players: [],
    markers: createMarkers(),
    turn: null,
    state: "created",
  };

  return gameFromState(state);
}

export function gameFromState(state: GameState): Game {
  return {
    state: state,
    id: state.id,
    applyAction: applyAction(state),
    addPlayer: addPlayer(state),
    removePlayer: removePlayer(state),
    start: start(state),
    restart: restart(state),
  };
}

export function gameFromJSON(json: GameDTO): Game {
  const state: GameState = {
    id: json.id,
    board: boardFromJSON(json.board),
    prices: pricesFromJSON(json.prices),
    players: json.players.map((p) => playerFromJSON(p)),
    markers: json.markers,
    turn: json.turn == null ? null : turnFromJSON(json.turn),
    state: json.state,
  };

  return gameFromState(state);
}

export function jsonFromGame(game: Game): GameDTO {
  return {
    id: game.state.id,
    board: jsonFromBoard(game.state.board),
    prices: jsonFromPrices(game.state.prices),
    players: game.state.players.map((p) => jsonFromPlayer(p)),
    markers: game.state.markers,
    turn: game.state.turn == null ? null : jsonFromTurn(game.state.turn),
    state: game.state.state,
  };
}
