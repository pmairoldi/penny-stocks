import { useCallback, useState } from "react";
import { server, Session } from "../../client";
import { GameDTO, GameLogEntryDTO } from "../../../../server/shared/dto";

export interface UseSessionValue {
  session: Session | undefined;
  loading: boolean;
  create: (name: string) => void;
  join: (id: string, name: string) => void;
}

export function useSession(notFound: () => void): UseSessionValue {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdate = useCallback((game: GameDTO) => {
    setSession((session) => {
      if (session != null) {
        return { ...session, game: game };
      } else {
        return undefined;
      }
    });
  }, []);

  const onGameLogRecieved = useCallback((log: GameLogEntryDTO) => {
    setSession((session) => {
      if (session != null) {
        return { ...session, logs: [log, ...session.logs] };
      } else {
        return undefined;
      }
    });
  }, []);

  const create = useCallback(
    (name: string) => {
      setLoading(true);
      server
        .create(name, onUpdate, onGameLogRecieved)
        .then((session) => {
          setSession(session);
        })
        .catch(() => {
          setSession(undefined);
          notFound();
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setSession, setLoading, onUpdate, onGameLogRecieved, notFound]
  );

  const join = useCallback(
    (id: string, name: string) => {
      setLoading(true);
      server
        .join(id, name, onUpdate, onGameLogRecieved)
        .then((session) => {
          setSession(session);
        })
        .catch(() => {
          setSession(undefined);
          notFound();
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setSession, setLoading, onUpdate, onGameLogRecieved, notFound]
  );

  return { session, loading, create: create, join: join };
}
