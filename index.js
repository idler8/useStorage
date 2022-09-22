import { useCallback, useEffect, useState } from 'react';
// TODO 多页面监听
export function factory(getItem, setItem) {
  const Cache = {};
  const Listener = [];
  function setStorage(key, value, ignoreEvents) {
    setItem(key, value);
    Cache[key] = value;
    if (!ignoreEvents) Listener.forEach((fn) => fn(key));
  }
  function getStorage(key) {
    return Cache[key] || getItem(key);
  }
  function useStorage(key) {
    const [ value, setValue ] = useState(() => getStorage(key));
    const updateValue = useCallback((value) => setStorage(key, value), [ key ]);
    useEffect(() => {
      setValue(getStorage(key));
      const listenFunc = (keyChange) => keyChange === key && setValue(Cache[key]);
      Listener.push(listenFunc);
      return () => Listener.splice(Listener.indexOf(listenFunc), 1);
    }, [ key ]);
    return [ value, updateValue ];
  }
  useStorage.setStorage = setStorage;
  useStorage.getStorage = getStorage;
  return useStorage;
}
export default factory(function(key, value) {
  localStorage[key] = JSON.stringify(value);
}, function(key) {
  try {
    return JSON.parse(localStorage[key]);
  } catch (e) {
    return null;
  }
});