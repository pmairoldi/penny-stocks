import { FC, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "./Button";

interface PayersDropdownProps {}

const Dropdown = styled.div`
  position: relative;
`;

const DropdownToggle = styled(Button)``;

const DropdownContent = styled.div`
  position: absolute;
  top: 38px;
  background: transparent;
  width: 260px;
`;

export const PlayersDropdown: FC<PayersDropdownProps> = (props) => {
  const { children } = props;
  const [opened, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setOpen(!opened);
  }, [opened, setOpen]);

  const onOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (opened === false) {
        return;
      }

      const target = event.target as Node | null;

      if (toggleRef.current?.contains(target)) {
        return;
      }

      if (contentRef.current?.contains(target)) {
        return;
      }

      setOpen(!opened);
    },
    [toggleRef, contentRef, opened, setOpen]
  );

  useEffect(() => {
    window.addEventListener("click", onOutsideClick);

    return () => {
      window.removeEventListener("click", onOutsideClick);
    };
  }, [onOutsideClick]);

  return (
    <Dropdown>
      <DropdownToggle ref={toggleRef} onClick={toggleDropdown}>
        Players
      </DropdownToggle>
      {opened === true ? (
        <DropdownContent ref={contentRef}>{children}</DropdownContent>
      ) : null}
    </Dropdown>
  );
};
