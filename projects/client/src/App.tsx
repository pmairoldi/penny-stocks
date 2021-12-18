import { FC } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { Home, Room } from "./pages";

const AppContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background: #e4dfda;
`;

const App: FC = () => {
  return (
    <AppContainer>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/room/create">
          <Room />
        </Route>
        <Route path="/room/:id">
          <Room />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </AppContainer>
  );
};

export default App;
