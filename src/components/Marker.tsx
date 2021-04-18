import { FC, useMemo } from "react";
import { Marker as MarkerModel } from "../model";
import "./Marker.css";

interface MarkerProps {
  marker: MarkerModel;
}

export const Marker: FC<MarkerProps> = (props) => {
  const { marker } = props;

  const className = useMemo(() => {
    return `Marker Marker-${marker}`;
  }, [marker]);

  return <div className={className}></div>;
};
