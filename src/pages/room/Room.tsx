import { FC, useCallback, useEffect, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Game } from "../../components";
import { CreateUser } from "./CreateUser";
import { useSession } from "./useSession";

export const Room: FC = () => {
  const history = useHistory();

  const onNotFound = useCallback(() => {
    history.replace("/");
  }, [history]);

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
      history.replace(`/room/${game.id}`);
    }
  }, [game, history]);

  return (
    <>
      {session == null ? (
        <CreateUser id={id} server={server} />
      ) : (
        <Game me={session.me} game={session.game} updateGame={session.update} />
      )}
    </>
  );
};
