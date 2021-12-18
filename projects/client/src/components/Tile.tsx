import { FC, useCallback, useMemo } from "react";
import styled, { css } from "styled-components";
import { MarkerDTO, ModifierDTO } from "../../../shared/dto";
import { Marker } from "./Marker";
import { textForModifier } from "./util";

interface DefaultTileProps {
  row: number;
  column: number;
  marker: MarkerDTO | null;
  onClick: (row: number, column: number) => void;
}

const StyledTile = styled.button`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  font-size: 14px;

  &:not(:disabled) {
    cursor: pointer;
  }
`;

const StyledDefaultTile = styled(StyledTile)`
  border-width: 1px;
  border-style: solid;
  background-color: #dccaaf;
  border-color: #d4b483;
`;

export const DefaultTile: FC<DefaultTileProps> = (props) => {
  const { row, column, marker, onClick: clickHandler } = props;

  const disabled = useMemo(() => {
    return marker != null;
  }, [marker]);

  const onClick = useCallback(() => {
    clickHandler(row, column);
  }, [row, column, clickHandler]);

  return (
    <StyledDefaultTile onClick={onClick} disabled={disabled}>
      {marker != null ? <StyledTileMarker marker={marker} /> : null}
    </StyledDefaultTile>
  );
};

interface ModifierTileProps {
  row: number;
  column: number;
  modifier: ModifierDTO;
  marker: MarkerDTO | null;
  onClick: (row: number, column: number) => void;
}

const StyledModifierTile = styled(StyledTile)<{
  kind: "green" | "red" | "blue";
}>`
  border-width: 1px;
  border-style: solid;
  ${(props) => {
    switch (props.kind) {
      case "green":
        return css`
          background-color: #96c4c0;
          border-color: #48a9a6;
        `;
      case "red":
        return css`
          background-color: #d69a9c;
          border-color: #c77478;
        `;
      case "blue":
        return css`
          background-color: #9a9bd6;
          border-color: #7479c7;
          color: #ffffff;
        `;
    }
  }}
`;

const StyledModiferText = styled.div``;

const StyledTileMarker = styled(Marker)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const ModifierTile: FC<ModifierTileProps> = (props) => {
  const { row, column, modifier, marker, onClick: clickHandler } = props;

  const disabled = useMemo(() => {
    return marker != null;
  }, [marker]);

  const onClick = useCallback(() => {
    clickHandler(row, column);
  }, [row, column, clickHandler]);

  const isSpecial = useMemo(() => {
    switch (modifier) {
      case "crash":
      case "payday":
        return true;
      default:
        return false;
    }
  }, [modifier]);

  const kind = useMemo(() => {
    switch (modifier) {
      case "plus-1":
      case "plus-2":
      case "plus-3":
        return "green";
      case "plus-5":
        return "blue";
      case "minus-1":
      case "minus-2":
      case "minus-3":
        return "red";
      case "crash":
        return marker != null ? "red" : "blue";
      case "payday":
        return marker != null ? "green" : "blue";
    }
  }, [modifier, marker]);

  const modifierText = useMemo(() => {
    return textForModifier(modifier);
  }, [modifier]);

  return (
    <StyledModifierTile onClick={onClick} disabled={disabled} kind={kind}>
      {isSpecial ? (
        marker != null ? (
          <StyledModiferText>{modifierText}</StyledModiferText>
        ) : null
      ) : (
        <StyledModiferText>{modifierText}</StyledModiferText>
      )}
      {marker != null ? <StyledTileMarker marker={marker} /> : null}
    </StyledModifierTile>
  );
};

interface StartTileProps {
  row: number;
  column: number;
  marker: MarkerDTO;
}

const StyledStartTile = styled(StyledTile)<{ color: MarkerDTO }>`
  background-color: ${(props) => {
    switch (props.color) {
      case "blue":
        return "blue";
      case "purple":
        return "purple";
      case "yellow":
        return "yellow";
      case "red":
        return "red";
    }
  }};

  color: ${(props) => {
    switch (props.color) {
      case "blue":
        return "white";
      case "purple":
        return "white";
      case "yellow":
        return "black";
      case "red":
        return "white";
    }
  }};
`;

export const StartTile: FC<StartTileProps> = (props) => {
  const { marker } = props;

  return <StyledStartTile color={marker}>Start</StyledStartTile>;
};
