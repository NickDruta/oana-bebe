import { useRef, useEffect } from 'react';

interface Props {
  handleClickAway: () => void;
}

/**
 * Hook for handling clicks outside a specified element.
 * @param {Object} options - The options object.
 * @param {Function} options.handleClickAway - The callback function to be called when a click outside occurs.
 * @return {RefObject<HTMLElement>} - A ref object that should be attached to the element you want to monitor clicks outside.
 * @example
 * const handleClickAway = () => {
 *     // Handle click away behavior here
 * };
 * const wrapperRef = useClickAwayListener({ handleClickAway });
 */
export const useClickAwayListener = ({ handleClickAway }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        handleClickAway();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [handleClickAway]);

  return wrapperRef;
};