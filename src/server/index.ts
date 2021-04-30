import { createServer } from "http";
import { Server } from "socket.io";
import {
  createGame,
  createPlayer,
  Game,
  GameDTO,
  gameFromJSON,
  jsonFromGame,
  jsonFromPlayer,
} from "./model";

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
    const id = `${Math.floor(Math.random() * 101)}`;

    const me = createPlayer(socket.id, socket.data.username);
    const game = createGame(id, [me]);

    games.set(id, game);

    socket.emit("start", {
      me: jsonFromPlayer(me),
      game: jsonFromGame(game),
    });
  });

  socket.on("join", ({ id }: { id: string }) => {
    const me = createPlayer(socket.id, socket.data.username);
    const game = games.get(id);

    if (game == null) {
      socket.emit("not found");
    } else {
      const updated = game.addPlayer(me);

      games.set(id, updated);

      socket.emit("start", {
        me: jsonFromPlayer(me),
        game: jsonFromGame(updated),
      });

      socket.broadcast.emit("update", jsonFromGame(updated));
    }
  });

  socket.on("update", (dto: GameDTO) => {
    const id = dto.id;
    const game = games.get(dto.id);

    if (game != null) {
      games.set(id, gameFromJSON(dto));
    }

    socket.emit("update", dto);
    socket.broadcast.emit("update", dto);
  });

  // notify users upon disconnection
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
