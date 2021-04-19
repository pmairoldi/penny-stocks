import { Marker } from "./marker";

interface PlayerState {
  markers: Marker[];
  value: number;
}

export interface Player {
  id: string;
  name: string;
  state: PlayerState;
}

export function createPlayer(id: string, name: string): Player {
  return { id: id, name: name, state: { markers: [], value: 20 } };
}
