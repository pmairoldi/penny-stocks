import { FC, useMemo } from "react";
import styled from "styled-components";
import { Turn as TurnModel } from "../server/model";
import { Button } from "./Button";
import { Marker } from "./Marker";

interface TurnProps {
  turn: TurnModel;
  endTurn: () => void;
}

const TurnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * ~ * {
    margin-left: 8px;
  }
`;

const DataContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;

  > * ~ * {
    margin-left: 8px;
  }

  > *:first-child {
    flex: 1;
  }
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * ~ * {
    margin-left: 8px;
  }
`;

export const Turn: FC<TurnProps> = (props) => {
  const { turn, endTurn } = props;

  const endTurnDisabled = useMemo(() => {
    return !turn.canEnd();
  }, [turn]);

  return (
    <TurnContainer>
      <DataContainer>
        <DataItem>Trades Remaining: {turn.state.tradesRemaining}</DataItem>
        <DataItem>
          {turn.state.markers.map((m, index) => {
            return <Marker key={`${m}-${index}`} marker={m} />;
          })}
        </DataItem>
      </DataContainer>
      <Button onClick={endTurn} disabled={endTurnDisabled}>
        End Turn
      </Button>
    </TurnContainer>
  );
};
