import { useCallback, useLayoutEffect, useState } from "react";
import useEventListener from "./useEventListener";

const calculateStyles = <T extends Element>(el: T | null) => {
  if (el) {
    const styles = window.getComputedStyle(el);
    return {
      left: parseFloat(styles.paddingLeft),
      right: parseFloat(styles.paddingRight),
      top: parseFloat(styles.paddingTop),
      bottom: parseFloat(styles.paddingBottom),
      width: parseFloat(styles.width),
      height: parseFloat(styles.height),
    };
  } else {
    return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  }
};

const rectOffset = (
  container: { width: number; height: number },
  rect: { width: number; height: number }
) => {
  const widthOffset = rect.width - container.width;
  const heigthOffset = rect.height - container.height;
  return {
    width: widthOffset,
    height: heigthOffset,
    fits: widthOffset <= 0 && heigthOffset <= 0,
  };
};

const calculateScale = <T extends Element>(
  frame: { width: number; height: number },
  el: T | null
) => {
  const styles = calculateStyles(el);
  const scaleWidth = (styles.width - styles.left - styles.right) / frame.width;
  const scaleHeight =
    (styles.height - styles.top - styles.bottom) / frame.height;

  const widthRect = rectOffset(
    { width: styles.width, height: styles.height },
    { width: scaleWidth * frame.width, height: scaleWidth * frame.height }
  );

  const heightRect = rectOffset(
    { width: styles.width, height: styles.height },
    { width: scaleHeight * frame.width, height: scaleHeight * frame.height }
  );

  if (widthRect.fits && heightRect.fits) {
    return widthRect.width <= heightRect.width ? scaleWidth : scaleHeight;
  } else if (widthRect.fits && !heightRect.fits) {
    return scaleWidth;
  } else if (!widthRect.fits && heightRect.fits) {
    return scaleHeight;
  } else {
    //none fit
    return 0;
  }
};

const useScale = <T extends Element>(
  width: number,
  height: number,
  el: T | null
) => {
  const [scale, setScale] = useState(1);

  const calc = useCallback(() => {
    const scale = calculateScale({ width, height }, el);
    if (isNaN(scale)) {
      setScale(1);
    } else {
      setScale(scale);
    }
  }, [width, height, el, setScale]);

  useLayoutEffect(() => {
    calc();
  }, [calc]);

  useEventListener("resize", calc);

  return scale;
};

export default useScale;
