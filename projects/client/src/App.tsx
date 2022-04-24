import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/room/create" element={<Room />}></Route>
        <Route path="/room/:id" element={<Room />}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </AppContainer>
  );
};

export default App;
