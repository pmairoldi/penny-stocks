import { Marker } from "./marker";
import { Player } from "./player";
import { shuffle } from "./utils";

export interface Turn {
  player: Player;
  markers: Marker[];
  marker: Marker | null;
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
      turn: {
        player: player,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
      },
      markers: [],
    };
  } else {
    turnMarkers.push(firstPick.item);
  }

  const secondPick = pick(firstPick.remaining);
  if (secondPick == null) {
    return {
      turn: {
        player: player,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
      },
      markers: [],
    };
  } else {
    turnMarkers.push(secondPick.item);
  }

  const thirdPick = pick(secondPick.remaining);
  if (thirdPick == null) {
    return {
      turn: {
        player: player,
        markers: turnMarkers,
        marker: turnMarkers.length > 0 ? turnMarkers[0] : null,
      },
      markers: [],
    };
  } else {
    turnMarkers.push(thirdPick.item);
  }

  return {
    turn: {
      player: player,
      markers: turnMarkers,
      marker: turnMarkers[0],
    },
    markers: thirdPick.remaining,
  };
}
