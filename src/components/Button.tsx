import styled from "styled-components";

export const LargeButton = styled.button`
  border-radius: 16px;
  padding: 16px;
  text-decoration: none;
  min-width: 200px;
  font-size: 1rem;
  text-align: left;
  border: none;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  transition-property: background-color, opacity;
  background-color: #4357ad;
  color: white;

  &:not(:disabled) {
    cursor: pointer;
  }

  &:not(:disabled):hover {
    background-color: #4c86b0;
  }

  &:disabled {
    opacity: 0.7;
  }
`;

export const Button = styled(LargeButton)`
  border-radius: 8px;
  font-size: 0.8rem;
  padding: 8px;
  min-width: 100px;
`;
