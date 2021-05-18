import { ActionDTO, GameDTO, GameLogEntryDTO, PlayerDTO } from "../server/dto";

export interface Session {
  me: PlayerDTO;
  game: GameDTO;
  logs: GameLogEntryDTO[];
  update: (action: ActionDTO) => void;
  start?: (id: string) => void;
  playAgain?: (id: string) => void;
  cleanup: () => void;
}

export type Create = (
  name: string,
  onUpdate: (game: GameDTO) => void,
  gameLogRecieved: (log: GameLogEntryDTO) => void
) => Promise<Session>;

export type Join = (
  gameId: string,
  name: string,
  onUpdate: (game: GameDTO) => void,
  gameLogRecieved: (log: GameLogEntryDTO) => void
) => Promise<Session>;

export interface Server {
  create: Create;
  join: Join;
}
