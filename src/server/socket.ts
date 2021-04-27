import { io } from "socket.io-client";
import {
  Game,
  GameDTO,
  gameFromJSON,
  jsonFromGame,
  PlayerDTO,
  playerFromJSON,
} from "../model";
import { Server } from "./server";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const server: Server = {
  create: (name, onUpdate) => {
    return new Promise((resolve) => {
      socket.auth = { username: name };
      socket.connect();

      const update = (game: Game) => {
        socket.emit("update", jsonFromGame(game));
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
    return new Promise((resolve) => {
      socket.auth = { username: name };
      socket.connect();

      const update = (game: Game) => {
        socket.emit("update", jsonFromGame(game));
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

      socket.emit("join", { id: id });
    });
  },
};
