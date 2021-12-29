import styled from "styled-components";

type VerticalAlignment = "center" | "top" | "bottom" | "baseline";

interface HStackProps {
  alignment?: VerticalAlignment;
  reverse?: boolean;
  wrap?: boolean;
}

export const HStack = styled.div<HStackProps>`
  box-sizing: border-box;
  flex: none;
  display: flex;
  flex-direction: ${(props) =>
    props.reverse === true ? "row-reverse" : "row"};
  flex-wrap: ${(props) => (props.wrap === true ? "wrap" : "nowrap")};
  align-items: ${(props) => {
    switch (props.alignment) {
      case "center":
        return "center";

      case "bottom":
        return "flex-end";

      case "baseline":
        return "baseline";

      case "top":
      default:
        return "flex-start";
    }
  }};
`;
