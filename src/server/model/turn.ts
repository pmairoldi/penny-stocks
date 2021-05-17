import { TurnDTO } from "../dto";
import { Marker } from "./marker";
import { Player } from "./player";
import { shuffle } from "./utils";

interface TurnState {
  playerId: string;
  markers: Marker[];
  marker: Marker | null;
  tradesRemaining: number;
}

export interface Turn {
  state: TurnState;
  updateMarker(markers: Marker[]): Turn;
  canEnd: () => boolean;
  makeTrade: () => Turn;
  canMakeTrade: () => boolean;
}

function pick<T>(array: T[]): { item: T; remaining: T[] } | null {
  if (array.length === 0) {
    return null;
  }

  const randomize = shuffle(array);
  return { item: randomize[0], remaining: randomize.slice(1) };
}

export function createTurn(
  player: Player,
  markers: Marker[]
): { turn: Turn; markers: Marker[] } {
  const turnMarkers = new Array<Marker>();
  const firstPick = pick(markers.slice());
  if (firstPick == null) {
    return {
      turn: turnFromState({
        playerId: player.id,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
        tradesRemaining: 2,
      }),
      markers: [],
    };
  } else {
    turnMarkers.push(firstPick.item);
  }

  const secondPick = pick(firstPick.remaining);
  if (secondPick == null) {
    return {
      turn: turnFromState({
        playerId: player.id,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
        tradesRemaining: 2,
      }),
      markers: [],
    };
  } else {
    turnMarkers.push(secondPick.item);
  }

  const thirdPick = pick(secondPick.remaining);
  if (thirdPick == null) {
    return {
      turn: turnFromState({
        playerId: player.id,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
        tradesRemaining: 2,
      }),
      markers: [],
    };
  } else {
    turnMarkers.push(thirdPick.item);
  }

  return {
    turn: turnFromState({
      playerId: player.id,
      markers: turnMarkers,
      marker: turnMarkers[0],
      tradesRemaining: 2,
    }),
    markers: thirdPick.remaining,
  };
}

const updateMarker = (state: TurnState) => {
  return (markers: Marker[]): Turn => {
    const updated: TurnState = {
      ...state,
      markers: markers,
      marker: markers.length > 0 ? markers[0] : null,
    };

    return turnFromState(updated);
  };
};

const canEnd = (state: TurnState) => {
  return (): boolean => {
    return state.markers.length === 0;
  };
};

const makeTrade = (state: TurnState) => {
  return () => {
    const updated: TurnState = {
      ...state,
      tradesRemaining: Math.max(0, state.tradesRemaining - 1),
    };

    return turnFromState(updated);
  };
};

const canMakeTrade = (state: TurnState) => {
  return () => {
    return state.tradesRemaining > 0;
  };
};

export function turnFromState(state: TurnState): Turn {
  return {
    state: state,
    updateMarker: updateMarker(state),
    canEnd: canEnd(state),
    makeTrade: makeTrade(state),
    canMakeTrade: canMakeTrade(state),
  };
}

export function turnFromJSON(json: TurnDTO): Turn {
  const state: TurnState = {
    playerId: json.playerId,
    markers: json.markers,
    marker: json.marker,
    tradesRemaining: json.tradesRemaining,
  };

  return turnFromState(state);
}

export function jsonFromTurn(turn: Turn): TurnDTO {
  return {
    playerId: turn.state.playerId,
    markers: turn.state.markers,
    marker: turn.state.marker,
    tradesRemaining: turn.state.tradesRemaining,
  };
}
