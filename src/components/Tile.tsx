import { FC, useCallback, useMemo } from "react";
import styled, { css } from "styled-components";
import { Marker as MarkerModel, Modifier } from "../server/model";
import { Marker } from "./Marker";

interface DefaultTileProps {
  row: number;
  column: number;
  marker: MarkerModel | null;
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
  modifier: Modifier;
  marker: MarkerModel | null;
  onClick: (row: number, column: number, modifer: Modifier) => void;
}

const StyledModifierTile = styled(StyledTile)<{ isSpecial: boolean }>`
  border-width: 1px;
  border-style: solid;
  ${(props) =>
    props.isSpecial
      ? css`
          background-color: #d69a9c;
          border-color: #c77478;
        `
      : css`
          background-color: #96c4c0;
          border-color: #48a9a6;
        `}
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
    clickHandler(row, column, modifier);
  }, [row, column, modifier, clickHandler]);

  const isSpecial = useMemo(() => {
    switch (modifier) {
      case "crash":
      case "payday":
      case "plus-5":
        return true;
      default:
        return false;
    }
  }, [modifier]);

  const modifierText = useMemo(() => {
    switch (modifier) {
      case "crash":
        return "Crash";
      case "payday":
        return "Dividend";
      case "plus-1":
        return "+1";
      case "plus-2":
        return "+2";
      case "plus-3":
        return "+3";
      case "plus-5":
        return "+5";
      case "minus-1":
        return "-1";
      case "minus-2":
        return "-2";
      case "minus-3":
        return "-3";
    }
  }, [modifier]);

  return (
    <StyledModifierTile
      onClick={onClick}
      disabled={disabled}
      isSpecial={isSpecial}
    >
      <StyledModiferText>{modifierText}</StyledModiferText>
      {marker != null ? <StyledTileMarker marker={marker} /> : null}
    </StyledModifierTile>
  );
};

interface StartTileProps {
  row: number;
  column: number;
  marker: MarkerModel;
}

const StyledStartTile = styled(StyledTile)<{ color: MarkerModel }>`
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
