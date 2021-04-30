import styled, { css } from "styled-components";
import { Marker as MarkerModel } from "../server/model";

interface MarkerProps {
  marker: MarkerModel;
}

export const Marker = styled.div<MarkerProps>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  border-color: black;
  ${(props) => {
    switch (props.marker) {
      case "blue":
        return css`
          background-color: blue;
          color: white;
        `;

      case "purple":
        return css`
          background-color: purple;
          color: white;
        `;

      case "yellow":
        return css`
          background-color: yellow;
          color: black;
        `;

      case "red":
        return css`
          background-color: red;
          color: white;
        `;
    }
  }}
`;
