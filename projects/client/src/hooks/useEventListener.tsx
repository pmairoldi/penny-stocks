import { useEffect, useMemo, useRef } from "react";

type Options = Pick<AddEventListenerOptions, "capture" | "passive">;

type EventMap = HTMLElementEventMap & DocumentEventMap & WindowEventMap;

interface EventHandler<K extends keyof EventMap> {
  (event: EventMap[K]): void;
}

const useEventListener = <K extends keyof EventMap>(
  eventName: K,
  handler: EventHandler<K>,
  element: HTMLElement | Window | Document = window,
  options?: Options
) => {
  const savedHandler = useRef<EventHandler<K> | null>(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  const capture = options ? options.capture : undefined;
  const passive = options ? options.passive : undefined;

  // Rerun the effect only if capture or passive has actually changed
  const memoOptions = useMemo(() => ({ capture, passive }), [capture, passive]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener: EventListener = (event) => {
      if (savedHandler.current) {
        savedHandler.current(event as EventMap[K]);
      }
    };

    element.addEventListener(eventName, eventListener, memoOptions);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, memoOptions]);
};

export default useEventListener;
