import { PlayerDTO } from "../dto";
import { Marker } from "./marker";

interface PlayerState {
  id: string;
  name: string;
  money: number;
  stocks: {
    [price in Marker]: number;
  };
}

export interface Player {
  state: PlayerState;
  id: string;
  name: string;
  crash: (marker: Marker, price: number) => Player;
  payday: (marker: Marker, price: number) => Player;
  buy: (marker: Marker, price: number) => Player;
  sell: (marker: Marker, price: number) => Player;
}

const crash = (state: PlayerState) => {
  return (marker: Marker, price: number): Player => {
    const { money, stocks } = state;
    const stock = stocks[marker];

    const updatedMoney = money - stock * price;
    const updated = { ...state, money: updatedMoney };

    return playerFromState(updated);
  };
};

const payday = (state: PlayerState) => {
  return (marker: Marker, price: number): Player => {
    const { money, stocks } = state;
    const stock = stocks[marker];

    const updatedMoney = money + stock * price;
    const updated = { ...state, money: updatedMoney };

    return playerFromState(updated);
  };
};

const buy = (state: PlayerState) => {
  return (marker: Marker, price: number) => {
    const { money, stocks } = state;

    const updatedMoney = money - price;
    const updatedStocks = { ...stocks };
    updatedStocks[marker] = updatedStocks[marker] + 1;

    const updated = {
      ...state,
      money: updatedMoney,
      stocks: updatedStocks,
    };

    return playerFromState(updated);
  };
};

const sell = (state: PlayerState) => {
  return (marker: Marker, price: number) => {
    const { money, stocks } = state;

    const updatedMoney = money + price;
    const updatedStocks = { ...stocks };
    updatedStocks[marker] = updatedStocks[marker] - 1;

    const updated = {
      ...state,
      money: updatedMoney,
      stocks: updatedStocks,
    };

    return playerFromState(updated);
  };
};

export function createPlayer(id: string, name: string): Player {
  const state: PlayerState = {
    id: id,
    name: name,
    money: 20,
    stocks: { red: 1, blue: 1, purple: 1, yellow: 1 },
  };

  return playerFromState(state);
}

export function playerFromState(state: PlayerState): Player {
  return {
    state: state,
    id: state.id,
    name: state.name,
    crash: crash(state),
    payday: payday(state),
    buy: buy(state),
    sell: sell(state),
  };
}

export function playerFromJSON(json: PlayerDTO): Player {
  const state: PlayerState = {
    id: json.id,
    name: json.name,
    money: json.money,
    stocks: json.stocks,
  };

  return playerFromState(state);
}

export function jsonFromPlayer(player: Player): PlayerDTO {
  return {
    id: player.state.id,
    name: player.state.name,
    money: player.state.money,
    stocks: player.state.stocks,
  };
}
