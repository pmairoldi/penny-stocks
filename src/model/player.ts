import { Marker } from "./marker";

type PlayserStocksType = {
  [price in Marker]: number;
};

interface PlayerState {
  money: number;
  stocks: PlayserStocksType;
}

export interface Player {
  id: string;
  name: string;
  state: PlayerState;
}

export function createPlayer(id: string, name: string): Player {
  return {
    id: id,
    name: name,
    state: { money: 20, stocks: { red: 1, blue: 1, purple: 1, yellow: 1 } },
  };
}
