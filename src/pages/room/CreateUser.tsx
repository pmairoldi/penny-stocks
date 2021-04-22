import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { UseSessionValue } from "./useSession";

interface Props {
  id: string | undefined;
  server: UseSessionValue;
}

export const CreateUser: FC<Props> = (props) => {
  const { id, server } = props;
  const { loading, create, join } = server;

  const [name, setName] = useState("");

  const onNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [setName]
  );

  const disabledCreateButton = useMemo(() => {
    return name.trim().length === 0;
  }, [name]);

  const onCreateUser = useCallback(() => {
    if (id == null) {
      create(name);
    } else {
      join(id, name);
    }
  }, [id, name, create, join]);

  if (loading) {
    return <div>Creating</div>;
  } else {
    return (
      <div>
        <input type="text" value={name} onChange={onNameChange} />
        <button onClick={onCreateUser} disabled={disabledCreateButton}>
          Create
        </button>
      </div>
    );
  }
};
