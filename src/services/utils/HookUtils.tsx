import { useEffect, useRef } from 'react';

/**
 * See: https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
 * See: https://stackoverflow.com/a/53395342/5405197
 * @param callback Function to be called on interval
 * @param delay Delay in milliseconds
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
/**
 * https://stackoverflow.com/a/34425083/5405197
 * @param url Script URL to load
 */
export const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [url]);
};