import { Marker } from "./marker";
import { Player } from "./player";
import { shuffle } from "./utils";

interface TurnState {
  player: Player;
  markers: Marker[];
  marker: Marker | null;
}

export interface Turn {
  state: TurnState;
  updateMarker(markers: Marker[]): Turn;
  canEnd: () => boolean;
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
        player: player,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
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
        player: player,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
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
        player: player,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
      }),
      markers: [],
    };
  } else {
    turnMarkers.push(thirdPick.item);
  }

  return {
    turn: turnFromState({
      player: player,
      markers: turnMarkers,
      marker: turnMarkers[0],
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

export function turnFromState(state: TurnState): Turn {
  return {
    state: state,
    updateMarker: updateMarker(state),
    canEnd: canEnd(state),
  };
}

export function turnFromJSON(json: { [key: string]: any }): Turn {
  const state: TurnState = {
    player: json.player,
    markers: json.markers,
    marker: json.marker,
  };

  return turnFromState(state);
}
