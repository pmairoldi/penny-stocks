import { PlayerDTO } from "../dto";
import { Marker } from "./marker";
import { Prices } from "./prices";

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
  crash: (marker: Marker, prices: Prices) => Player;
  payday: (marker: Marker, prices: Prices) => Player;
  buy: (marker: Marker, prices: Prices) => Player;
  canBuy: (marker: Marker, prices: Prices) => boolean;
  sell: (marker: Marker, prices: Prices) => Player;
  canSell: (marker: Marker) => boolean;
}

const crash = (state: PlayerState) => {
  return (marker: Marker, prices: Prices): Player => {
    const { money, stocks } = state;
    const stock = stocks[marker];
    const price = prices.valueFor(marker);

    const updatedMoney = money - stock * price;
    const updated = { ...state, money: updatedMoney };

    return playerFromState(updated);
  };
};

const payday = (state: PlayerState) => {
  return (marker: Marker, prices: Prices): Player => {
    const { money, stocks } = state;
    const stock = stocks[marker];
    const price = prices.valueFor(marker);

    const updatedMoney = money + stock * price;
    const updated = { ...state, money: updatedMoney };

    return playerFromState(updated);
  };
};

const buy = (state: PlayerState) => {
  return (marker: Marker, prices: Prices) => {
    const { money, stocks } = state;
    const price = prices.valueFor(marker);

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

const canBuy = (state: PlayerState) => {
  return (marker: Marker, prices: Prices) => {
    const money = state.money;
    const price = prices.valueFor(marker);
    return price <= 0 ? true : money >= price;
  };
};

const sell = (state: PlayerState) => {
  return (marker: Marker, prices: Prices) => {
    const { money, stocks } = state;
    const price = prices.valueFor(marker);

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

const canSell = (state: PlayerState) => {
  return (marker: Marker) => {
    const stocks = state.stocks;
    return stocks[marker] > 0;
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
    canBuy: canBuy(state),
    sell: sell(state),
    canSell: canSell(state),
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
