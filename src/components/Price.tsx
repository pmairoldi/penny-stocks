import { FC, useMemo } from "react";
import { Marker, Price as PriceModel, valueFromRawValue } from "../model";
import "./Price.css";

interface PriceProps {
  marker: Marker;
  price: PriceModel;
}

export const Price: FC<PriceProps> = (props) => {
  const { marker, price } = props;

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

  return (
    <div className={className}>
      {marker}
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
