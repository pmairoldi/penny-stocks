import { FC, useCallback, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Game, Lobby } from "../../components";
import { GameOver } from "../../components/GameOver";
import { CreateUser } from "./CreateUser";
import { useSession } from "./useSession";

export const Room: FC = () => {
  const navigate = useNavigate();

  const onNotFound = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const server = useSession(onNotFound);

  const { id } = useParams<{ id: string }>();

  const session = useMemo(() => {
    return server.session;
  }, [server]);

  const game = useMemo(() => {
    return session?.game;
  }, [session]);

  useEffect(() => {
    if (game != null) {
      navigate(`/room/${game.id}`, { replace: true });
    }
  }, [game, navigate]);

  return (
    <>
      {session == null ? (
        <CreateUser id={id} server={server} />
      ) : session.game.state === "created" ? (
        <Lobby game={session.game} onStart={session.start} />
      ) : session.game.state === "gameover" ? (
        <GameOver
          me={session.me}
          game={session.game}
          onPlayAgain={session.playAgain}
        />
      ) : (
        <Game
          me={session.me}
          game={session.game}
          logs={session.logs}
          updateGame={session.update}
        />
      )}
    </>
  );
};
