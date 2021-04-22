import { FC } from "react";
import { Link } from "react-router-dom";

export const Home: FC = () => {
  return (
    <>
      <Link to="/room/create">Create</Link>
    </>
  );
};
