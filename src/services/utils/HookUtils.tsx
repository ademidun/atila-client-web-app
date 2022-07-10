import React, { useEffect, useRef } from 'react';

/**
 * See: https://overreacted.io/making-setinterval-declarative-with-react-hooks/#just-show-me-the-code
 * See: https://stackoverflow.com/a/53395342/5405197
 * @param {*} callback
 * @param {*} delay
 */
export function useInterval(callback: any, delay: any) {
  const savedCallback: React.MutableRefObject<any> = useRef();

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
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
/**
 * https://stackoverflow.com/a/34425083/5405197
 * @param url 
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