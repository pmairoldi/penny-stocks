import styled from "styled-components";

type HorizontalAlignment = "center" | "leading" | "trailing";

interface VStackProps {
  alignment?: HorizontalAlignment;
  reverse?: boolean;
  wrap?: boolean;
}

export const VStack = styled.div<VStackProps>`
  box-sizing: border-box;
  flex: none;
  display: flex;
  flex-direction: ${(props) =>
    props.reverse === true ? "column-reverse" : "column"};
  flex-wrap: ${(props) => (props.wrap === true ? "wrap" : "nowrap")};
  align-items: ${(props) => {
    switch (props.alignment) {
      case "center":
        return "center";

      case "trailing":
        return "flex-end";

      case "leading":
      default:
        return "flex-start";
    }
  }};
`;
