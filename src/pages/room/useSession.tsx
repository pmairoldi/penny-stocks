import { useCallback, useState } from "react";
import { Game } from "../../model";
import { server, Session } from "../../server";

export interface UseSessionValue {
  session: Session | undefined;
  loading: boolean;
  create: (name: string) => void;
  join: (id: string, name: string) => void;
}

export function useSession(): UseSessionValue {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdate = useCallback((game: Game) => {
    setSession((session) => {
      if (session != null) {
        return { ...session, game: game };
      } else {
        return undefined;
      }
    });
  }, []);

  const create = useCallback(
    (name: string) => {
      setLoading(true);
      server
        .create(name, onUpdate)
        .then((session) => {
          setSession(session);
        })
        .catch(() => {
          setSession(undefined);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setSession, setLoading, onUpdate]
  );

  const join = useCallback(
    (id: string, name: string) => {
      setLoading(true);
      server
        .join(id, name, onUpdate)
        .then((session) => {
          setSession(session);
        })
        .catch(() => {
          setSession(undefined);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setSession, setLoading, onUpdate]
  );

  return { session, loading, create: create, join: join };
}
