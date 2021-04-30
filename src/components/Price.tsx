import { FC, useCallback, useMemo } from "react";
import styled, { css } from "styled-components";
import {
  Marker,
  Price as PriceModel,
  valueFromRawValue,
} from "../server/model";
import { Button } from "./Button";

interface PriceProps {
  marker: Marker;
  price: PriceModel;
  onBuy: (marker: Marker) => void;
  onSell: (marker: Marker) => void;
  canBuy: boolean;
  canSell: boolean;
}

const StyledPrice = styled.div`
  background-color: #dccaaf;
  border-width: 1px;
  border-style: solid;
  border-color: #d4b483;
`;

const PriceHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-transform: capitalize;
  padding: 8px;
  background-color: #d4b483;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d4b483;

  span {
    flex: 1;
    font-weight: bold;
  }

  span ~ button {
    margin-left: 8px;
  }

  button ~ button {
    margin-left: 8px;
  }
`;

const PriceBar = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px;
`;

const PriceBarItem = styled.div<{ marker: Marker; selected: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    if (props.selected) {
      switch (props.marker) {
        case "blue":
          return css`
            background-color: blue;
            color: white;
          `;

        case "purple":
          return css`
            background-color: purple;
            color: white;
          `;

        case "yellow":
          return css`
            background-color: yellow;
            color: black;
          `;

        case "red":
          return css`
            background-color: red;
            color: white;
          `;
      }
    } else {
      return css`
        color: black;
      `;
    }
  }};
`;

export const Price: FC<PriceProps> = (props) => {
  const { marker, price, onBuy, onSell, canBuy, canSell } = props;

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

  const buy = useCallback(() => {
    onBuy(marker);
  }, [onBuy, marker]);

  const sell = useCallback(() => {
    onSell(marker);
  }, [onSell, marker]);

  return (
    <StyledPrice>
      <PriceHeader>
        <span>{marker}</span>
        <Button onClick={buy} disabled={!canBuy}>
          Buy
        </Button>
        <Button onClick={sell} disabled={!canSell}>
          Sell
        </Button>
      </PriceHeader>
      <PriceBar>
        {prices.map((price, index) => {
          return (
            <PriceBarItem
              key={`price-${index}`}
              marker={marker}
              selected={price.rawValue === rawValue}
            >
              {price.value}
            </PriceBarItem>
          );
        })}
      </PriceBar>
    </StyledPrice>
  );
};
