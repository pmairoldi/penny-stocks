import { io } from "socket.io-client";
import {
  Action,
  GameDTO,
  gameFromJSON,
  PlayerDTO,
  playerFromJSON,
} from "../server/model";
import { Server } from "./server";

const URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://penny-stocks.herokuapp.com/";

const socket = io(URL, { autoConnect: false });

if (process.env.NODE_ENV === "development") {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
}

export const server: Server = {
  create: (name, onUpdate) => {
    return new Promise((resolve) => {
      socket.auth = { username: name };
      socket.connect();

      const update = (action: Action) => {
        socket.emit("action", action);
      };

      const cleanup = () => {
        socket.disconnect();
      };

      socket.on("start", (dto: { me: PlayerDTO; game: GameDTO }) => {
        resolve({
          me: playerFromJSON(dto.me),
          game: gameFromJSON(dto.game),
          update: update,
          cleanup: cleanup,
        });
      });

      socket.on("update", (dto: GameDTO) => {
        onUpdate(gameFromJSON(dto));
      });

      socket.emit("create");
    });
  },
  join: (id, name, onUpdate) => {
    return new Promise((resolve, rejects) => {
      socket.auth = { username: name };
      socket.connect();

      const update = (action: Action) => {
        socket.emit("action", action);
      };

      const cleanup = () => {
        socket.disconnect();
      };

      socket.on("start", (dto: { me: PlayerDTO; game: GameDTO }) => {
        resolve({
          me: playerFromJSON(dto.me),
          game: gameFromJSON(dto.game),
          update: update,
          cleanup: cleanup,
        });
      });

      socket.on("update", (dto: GameDTO) => {
        onUpdate(gameFromJSON(dto));
      });

      socket.on("not found", () => {
        rejects("NO GAME");
      });

      socket.emit("join", { id: id });
    });
  },
};
