import { PricesDTO } from "../dto";
import { Marker } from "./marker";

export interface Price {
  rawValue: number;
  value: number;
  min: number;
  max: number;
}

type PricesState = {
  [price in Marker]: Price;
};

export interface Prices {
  state: PricesState;
  updatePrice(marker: Marker, by: number): Prices;
}

const defaultPrice = 5;
const maxPrice = 25;
const minPrice = -5;

function valueFromRawValue(rawValue: number) {
  return Math.max(0, rawValue);
}

const updatePrice = (state: PricesState) => {
  return (marker: Marker, by: number): Prices => {
    const price = state[marker];
    const rawValue = Math.max(
      Math.min(price.rawValue + by, price.max),
      price.min
    );
    const value = valueFromRawValue(rawValue);

    const updated = { ...state };
    updated[marker] = { ...price, rawValue: rawValue, value: value };

    return pricesFromState(updated);
  };
};

export function createPrices(): Prices {
  const state: PricesState = {
    blue: {
      rawValue: defaultPrice,
      value: valueFromRawValue(defaultPrice),
      min: minPrice,
      max: maxPrice,
    },
    purple: {
      rawValue: defaultPrice,
      value: valueFromRawValue(defaultPrice),
      min: minPrice,
      max: maxPrice,
    },
    yellow: {
      rawValue: defaultPrice,
      value: valueFromRawValue(defaultPrice),
      min: minPrice,
      max: maxPrice,
    },
    red: {
      rawValue: defaultPrice,
      value: valueFromRawValue(defaultPrice),
      min: minPrice,
      max: maxPrice,
    },
  };

  return pricesFromState(state);
}

export function pricesFromState(state: PricesState): Prices {
  return {
    state: state,
    updatePrice: updatePrice(state),
  };
}

export function pricesFromJSON(json: PricesDTO): Prices {
  return pricesFromState(json);
}

export function jsonFromPrices(prices: Prices): PricesDTO {
  return prices.state;
}
