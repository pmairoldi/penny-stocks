import { Marker } from "./marker";

export interface Price {
  rawValue: number;
  value: number;
  min: number;
  max: number;
}

type PricesType = {
  [price in Marker]: Price;
};

export interface Prices extends PricesType {
  updatePrice(marker: Marker, by: number): Prices;
}

const defaultPrice = 5;
const maxPrice = 25;
const minPrice = -5;

export function valueFromRawValue(rawValue: number) {
  if (rawValue < 0) {
    return 0;
  } else {
    return rawValue;
  }
}

export function createPrices(): Prices {
  const state: PricesType = {
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

  const updatePrice = (state: PricesType) => {
    return (marker: Marker, by: number): Prices => {
      const price = state[marker];
      const rawValue = Math.max(
        Math.min(price.rawValue + by, price.max),
        price.min
      );
      const value = valueFromRawValue(rawValue);

      const updated = { ...state };
      updated[marker] = { ...price, rawValue: rawValue, value: value };

      return {
        ...updated,
        updatePrice: updatePrice(updated),
      };
    };
  };

  return {
    ...state,
    updatePrice: updatePrice(state),
  };
}
