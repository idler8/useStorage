import { useCallback, useEffect, useState } from 'react';
const Cache = {};
const Listener = [];
// TODO 是否有必要处理
// window.addEventListener('storage', ({ key, newValue }) => {
//   if (!key) return Object.keys(Cache).forEach(key => delete Cache[key]);
//   Cache[key] = newValue;
//   Listener.forEach((fn) => fn(key));
// });
export function setStorage(key, value, ignoreEvents) {
  localStorage[key] = JSON.stringify(value);
  Cache[key] = value;
  if (!ignoreEvents) Listener.forEach((fn) => fn(key));
}
export function getStorage(key) {
  try {
    return Cache[key] || JSON.parse(localStorage[key]);
  } catch (e) {
    return null;
  }
}
export default function useStorage(key) {
  const [ value, setValue ] = useState(Cache[key] || (() => Cache[key] = getStorage(key)));
  const updateValue = useCallback((value) => {
    setStorage(key, value);
  }, [ key ]);
  useEffect(() => {
    setValue(Cache[key]);
    const listenFunc = (keyChange) => keyChange === key && setValue(Cache[key]);
    Listener.push(listenFunc);
    return () => Listener.splice(Listener.indexOf(listenFunc), 1);
  }, [ key ]);
  return [ value, updateValue ];
}