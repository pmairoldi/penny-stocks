import { FC, useEffect, useState } from "react";
import "./App.css";
import { Game } from "./components";
import { connect, Server } from "./server";

const App: FC = () => {
  const [server, updateServer] = useState<Server>();

  useEffect(() => {
    const { server, cleanup } = connect("test-game", (game) => {
      updateServer({ ...server, game: game });
    });

    updateServer(server);

    return () => {
      cleanup();
    };
  }, [updateServer]);

  return (
    <div className="App">
      {server == null ? (
        "connect"
      ) : (
        <>
          <Game game={server.game} updateGame={server.update} />
          <button className="Clear" onClick={server.clear}>
            Clear
          </button>
        </>
      )}
    </div>
  );
};

export default App;
