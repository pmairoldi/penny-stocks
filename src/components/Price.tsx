import { FC, useCallback, useMemo } from "react";
import { Marker, Price as PriceModel, valueFromRawValue } from "../model";
import "./Price.css";

interface PriceProps {
  marker: Marker;
  price: PriceModel;
  onBuy: (marker: Marker) => void;
  onSell: (marker: Marker) => void;
}

export const Price: FC<PriceProps> = (props) => {
  const { marker, price, onBuy, onSell } = props;

  const min = useMemo(() => {
    return price.min;
  }, [price]);

  const max = useMemo(() => {
    return price.max;
  }, [price]);

  const rawValue = useMemo(() => {
    return price.rawValue;
  }, [price]);

  const prices = useMemo(() => {
    const values = new Array<{ rawValue: number; value: number }>();
    for (let i = min; i <= max; ++i) {
      values.push({ rawValue: i, value: valueFromRawValue(i) });
    }
    return values;
  }, [min, max]);

  const className = useMemo(() => {
    return `Price Price-${marker}`;
  }, [marker]);

  const buy = useCallback(() => {
    onBuy(marker);
  }, [onBuy, marker]);

  const sell = useCallback(() => {
    onSell(marker);
  }, [onSell, marker]);

  return (
    <div className={className}>
      <div className="Price-header">
        <span>{marker}</span>
        <button onClick={buy}>Buy</button>
        <button onClick={sell}>Sell</button>
      </div>
      <div className="Price-bar">
        {prices.map((price, index) => {
          return (
            <div
              key={`price-${index}`}
              className={
                price.rawValue === rawValue
                  ? "Price-bar-item Price-bar-item-selected"
                  : "Price-bar-item"
              }
            >
              {price.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};
