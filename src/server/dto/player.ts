import { MarkerDTO } from "./marker";

export interface PlayerDTO {
  id: string;
  name: string;
  money: number;
  stocks: {
    [price in MarkerDTO]: number;
  };
}
