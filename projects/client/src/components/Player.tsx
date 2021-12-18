import { FC, ReactElement } from "react";
import styled from "styled-components";
import { PlayerDTO } from "../../../server/shared/dto";
import { Marker } from "./Marker";

interface PlayerProps {
  player: PlayerDTO;
  showMoney: boolean;
  turn?: ReactElement;
  active?: boolean;
}

const StyledPlayer = styled.div`
  background-color: #dccaaf;
  border-width: 1px;
  border-style: solid;
  border-color: #d4b483;
`;

const PlayerName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-transform: capitalize;
  padding: 8px;
  background-color: #d4b483;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #d4b483;

  span:first-child {
    flex: 1;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  justify-content: space-around;
`;

const TurnContainer = styled.div`
  padding: 8px;
`;

const PlayerMarker = styled(Marker)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
`;

export const Player: FC<PlayerProps> = (props) => {
  const { player, turn, active, showMoney } = props;

  return (
    <StyledPlayer>
      <PlayerName>
        {active === true ? <>&#10148;</> : null}
        <span>{player.name}</span>
        {showMoney ? <span>${player.money}</span> : null}
      </PlayerName>
      <StatsContainer>
        <PlayerMarker marker="blue">{player.stocks.blue}</PlayerMarker>
        <PlayerMarker marker="purple">{player.stocks.purple}</PlayerMarker>
        <PlayerMarker marker="yellow">{player.stocks.yellow}</PlayerMarker>
        <PlayerMarker marker="red">{player.stocks.red}</PlayerMarker>
      </StatsContainer>

      {turn != null ? <TurnContainer>{turn}</TurnContainer> : null}
    </StyledPlayer>
  );
};
