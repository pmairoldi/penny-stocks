import { FC } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import { Home, Room } from "./pages";

const App: FC = () => {
  return (
    <div className="App">
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
        <Route path="*">{404}</Route>
      </Switch>
    </div>
  );
};

export default App;
