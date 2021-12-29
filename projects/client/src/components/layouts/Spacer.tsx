import styled from "styled-components";

interface SpacerProps {
  min?: number;
  max?: number;
}

export const HSpacer = styled.div.attrs<SpacerProps>((props) => {
  return {
    style: {
      "--hspacer-min": props.min == null ? undefined : `${props.min}px`,
      "--hspacer-max": props.max == null ? undefined : `${props.max}px`,
    },
  };
})<SpacerProps>`
  flex: auto;
  height: 100%;
  min-width: var(--hspacer-min);
  max-width: var(--hspacer-max);
`;

export const VSpacer = styled.div.attrs<SpacerProps>((props) => {
  return {
    style: {
      "--vspacer-min": props.min == null ? undefined : `${props.min}px`,
      "--vspacer-max": props.max == null ? undefined : `${props.max}px`,
    },
  };
})<SpacerProps>`
  flex: auto;
  width: 100%;
  min-height: var(--vspacer-min);
  max-height: var(--vspacer-max);
`;
