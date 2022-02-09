import { Howl } from "howler";
import { useMemo } from "react";

const useSoundEffect = (
  src: string,
  options?: { volume?: number; rate?: number }
) => {
  const volume = useMemo(() => {
    return options?.volume ?? 1.0;
  }, [options]);

  const rate = useMemo(() => {
    return options?.rate ?? 1.0;
  }, [options]);

  return useMemo(() => {
    const sound = new Howl({
      src: src,
      volume: volume,
      rate: rate,
    });

    const play = () => {
      sound.play();
    };

    const stop = () => {
      sound.stop();
    };

    return { play, stop };
  }, [src, volume, rate]);
};

export default useSoundEffect;
