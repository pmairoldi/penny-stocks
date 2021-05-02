import { FC } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LargeButton } from "../../components";

const HomeContainer = styled.div`
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

const Logo = styled.div`
  font-size: 6rem;
  font-weight: bold;
  color: #c1666b;
  text-align: center;
`;

export const Home: FC = () => {
  return (
    <HomeContainer>
      <Logo>Penny Stocks</Logo>
      <LargeButton as={Link} to="/room/create">
        Create
      </LargeButton>
    </HomeContainer>
  );
};
