import { io } from "socket.io-client";
import {
  ActionDTO,
  GameDTO,
  GameLogEntryDTO,
  PlayerDTO,
} from "@penny-stocks/shared";
import { Server } from "./server";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://penny-stocks.herokuapp.com/";

const socket = io(URL, { autoConnect: false });

if (process.env.NODE_ENV === "development") {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
}

export const server: Server = {
  create: (name, onUpdate, gameLogRecieved) => {
    return new Promise((resolve) => {
      socket.auth = { username: name };
      socket.connect();

      const update = (action: ActionDTO) => {
        socket.emit("action", action);
      };

      const start = (id: string) => {
        socket.emit("start", { id: id });
      };

      const playAgain = (id: string) => {
        socket.emit("restart", { id: id });
      };

      const cleanup = () => {
        socket.disconnect();
      };

      socket.on("created", (dto: { me: PlayerDTO; game: GameDTO }) => {
        resolve({
          me: dto.me,
          game: dto.game,
          logs: [],
          update: update,
          start: start,
          playAgain: playAgain,
          cleanup: cleanup,
        });
      });

      socket.on("update", (dto: GameDTO) => {
        onUpdate(dto);
      });

      socket.on("log", (dto: GameLogEntryDTO) => {
        gameLogRecieved(dto);
      });

      socket.emit("create");
    });
  },
  join: (id, name, onUpdate, gameLogRecieved) => {
    return new Promise((resolve, rejects) => {
      socket.auth = { username: name };
      socket.connect();

      const update = (action: ActionDTO) => {
        socket.emit("action", action);
      };

      const cleanup = () => {
        socket.disconnect();
      };

      socket.on("joined", (dto: { me: PlayerDTO; game: GameDTO }) => {
        resolve({
          me: dto.me,
          game: dto.game,
          logs: [],
          update: update,
          cleanup: cleanup,
        });
      });

      socket.on("update", (dto: GameDTO) => {
        onUpdate(dto);
      });

      socket.on("log", (dto: GameLogEntryDTO) => {
        gameLogRecieved(dto);
      });

      socket.on("not found", () => {
        rejects("NO GAME");
      });

      socket.emit("join", { id: id });
    });
  },
};
