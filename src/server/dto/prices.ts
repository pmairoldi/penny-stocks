import { MarkerDTO } from "./marker";

export type PricesDTO = {
  [price in MarkerDTO]: PriceDTO;
};

export interface PriceDTO {
  rawValue: number;
  value: number;
  min: number;
  max: number;
}
