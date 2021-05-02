import { Marker } from "./marker";
import { Prices } from "./prices";

type PlayserStocksType = {
  [price in Marker]: number;
};

interface PlayerState {
  id: string;
  name: string;
  money: number;
  stocks: PlayserStocksType;
}

export interface Player {
  state: PlayerState;
  id: string;
  name: string;
  crash: (marker: Marker, price: number) => Player;
  payday: (marker: Marker, price: number) => Player;
  buy: (marker: Marker, price: number) => Player;
  sell: (marker: Marker, price: number) => Player;
  score(prices: Prices): number;
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

const score = (state: PlayerState) => {
  return (prices: Prices) => {
    const { money, stocks } = state;

    const remaining =
      prices.state.blue.value * stocks.blue +
      prices.state.red.value * stocks.red +
      prices.state.yellow.value * stocks.yellow +
      prices.state.purple.value * stocks.purple;

    return money + remaining;
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
    score: score(state),
  };
}

export interface PlayerDTO {
  id: string;
  name: string;
  money: number;
  stocks: PlayserStocksType;
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
