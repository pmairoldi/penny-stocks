import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { LargeButton, Input } from "../../components";
import { UseSessionValue } from "./useSession";

interface Props {
  id: string | undefined;
  server: UseSessionValue;
}

const CreateUserContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  > * ~ * {
    margin-top: 16px;
  }
`;

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
    return <CreateUserContainer>Creating</CreateUserContainer>;
  } else {
    return (
      <CreateUserContainer>
        <Input
          type="text"
          value={name}
          placeholder="username"
          onChange={onNameChange}
        />
        <LargeButton onClick={onCreateUser} disabled={disabledCreateButton}>
          Create
        </LargeButton>
      </CreateUserContainer>
    );
  }
};
