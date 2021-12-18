import { createServer } from "http";
import { Server } from "socket.io";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import {
  ActionDTO,
  actionFromJSON,
  createGame,
  createPlayer,
  Game,
  GameLogEntryDTO,
  gameLogFromAction,
  jsonFromGame,
  jsonFromPlayer,
} from "./shared";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.username = username;
  next();
});

const games = new Map<string, Game>();

io.on("connection", (socket) => {
  socket.on("create", () => {
    const id = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      style: "lowerCase",
      length: 3,
    });

    const player = createPlayer(socket.id, socket.data.username);
    const game = createGame(id).addPlayer(player);

    games.set(id, game);

    socket.emit("created", {
      me: jsonFromPlayer(player),
      game: jsonFromGame(game),
    });
  });

  socket.on("join", ({ id }: { id: string }) => {
    const game = games.get(id);

    if (game == null) {
      socket.emit("not found");
    } else {
      const player = createPlayer(socket.id, socket.data.username);
      const updated = game.addPlayer(player);

      games.set(id, updated);

      socket.emit("joined", {
        me: jsonFromPlayer(player),
        game: jsonFromGame(updated),
      });

      socket.broadcast.emit("update", jsonFromGame(updated));
    }
  });

  socket.on("start", ({ id }: { id: string }) => {
    const game = games.get(id);

    if (game == null) {
      socket.emit("not found");
    } else {
      const updated = game.start();

      games.set(id, updated);

      const gameDTO = jsonFromGame(updated);

      socket.broadcast.emit("update", gameDTO);
      socket.emit("update", gameDTO);
    }
  });

  socket.on("restart", ({ id }: { id: string }) => {
    const game = games.get(id);

    if (game == null) {
      socket.emit("not found");
    } else {
      const updated = game.restart();

      games.set(id, updated);

      const gameDTO = jsonFromGame(updated);

      socket.broadcast.emit("update", gameDTO);
      socket.emit("update", gameDTO);
    }
  });

  socket.on("action", (actionDTO: ActionDTO) => {
    const id = actionDTO.gameId;
    const game = games.get(id);

    if (game != null) {
      const action = actionFromJSON(actionDTO, socket.id);
      if (game.canApply(action)) {
        const updated = game.applyAction(action);
        games.set(id, updated);

        const gameDTO = jsonFromGame(updated);
        socket.emit("update", gameDTO);
        socket.broadcast.emit("update", gameDTO);

        const event = gameLogFromAction(action, updated);
        if (event != null) {
          const log: GameLogEntryDTO = {
            event: event,
            playerId: socket.id,
            timestamp: new Date().toISOString(),
          };
          socket.emit("log", log);
          socket.broadcast.emit("log", log);
        }
      }
    }
  });

  socket.on("disconnect", () => {
    Array.from(games.entries()).forEach(([id, game]) => {
      const player = game.state.players.find((p) => p.id === socket.id);
      if (player != null) {
        const updated = game.removePlayer(player);

        if (updated.state.players.length > 0) {
          games.set(id, updated);
        } else {
          games.delete(id);
        }

        socket.broadcast.emit("update", jsonFromGame(updated));
      }
    });

    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
