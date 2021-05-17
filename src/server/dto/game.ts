import { BoardDTO } from "./board";
import { MarkerDTO } from "./marker";
import { PlayerDTO } from "./player";
import { PricesDTO } from "./prices";
import { TurnDTO } from "./turn";

export interface GameDTO {
  id: string;
  board: BoardDTO;
  prices: PricesDTO;
  players: PlayerDTO[];
  markers: MarkerDTO[];
  turn: TurnDTO | null;
  state: "created" | "in-progress" | "gameover";
}
