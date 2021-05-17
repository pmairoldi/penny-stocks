import { MarkerDTO } from "./marker";

export interface TurnDTO {
  playerId: string;
  markers: MarkerDTO[];
  marker: MarkerDTO | null;
  tradesRemaining: number;
}
