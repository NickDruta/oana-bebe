import { useRef, useEffect } from "react";

interface Props {
  handleClickAway: () => void;
  delayActivation?: boolean; // Optional prop to delay activation
}

export const useClickAwayListener = ({
  handleClickAway,
  delayActivation = false,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const activationDelay = useRef<boolean>(delayActivation);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (activationDelay.current) {
        return;
      }
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        handleClickAway();
      }
    };

    const enableListener = () => {
      activationDelay.current = false;
    };

    document.addEventListener("click", handleClick);
    setTimeout(enableListener, 10);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClickAway]);

  return wrapperRef;
};
