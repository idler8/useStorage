import { useCallback, useEffect, useState } from 'react';
export const CREATE = Symbol('Storage.Create')
export const UPDATE = Symbol('Storage.Update')
export const REMOVE = Symbol('Storage.Remove')
export const CLEAR = Symbol('Storage.Clear')
export function addWindowListener(Storage) {
  const handler = ({ key, oldValue, newValue }) => {
    if (key === undefined) return Storage.clear();
    if (!newValue === undefined) return Storage.remove(key);
    if (!oldValue === undefined) return Storage.create(key, newValue);
    return Storage.update(key, newValue);
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener(handler)
}
export function getJsonStorage(Storage) {
  return {
    getItem(key) {
      try {
        return JSON.parse(Storage.getItem(key));
      } catch (e) {
        return null;
      }
    },
    setItem(key, value) {
      Storage.setItem(key, JSON.stringify(value))
    },
    removeItem(key) {
      Storage.removeItem(key)
    },
    clear() {
      Storage.clear();
    }
  }
}
export function getListener() {
  const Listener = [];
  const addListener = (key, onChange) => {
    const handler = (keyChange, value) => {
      if(keyChange === CLEAR) onChange();
      if(keyChange === key) onChange(value);
    };
    Listener.push(handler);
    return () => Listener.splice(Listener.indexOf(handler), 1);
  }
  const updateValue = (key, value) => {
    Listener.forEach((fn) => fn(key, value));
  }
  return [addListener, updateValue];
}
export function hookFactory(Storage, [addListener, updateValue] = getListener()) {
  const jsonStorage = getJsonStorage(Storage);
  return function useStorage(key) {
    const [value, setValue] = useState(() => jsonStorage.getItem(key));
    const onChange = useCallback((value) => {
      jsonStorage.setItem(key, value);
      updateValue(key, value);
    }, [key]);
    useEffect(() => {
      setValue(jsonStorage.getItem(key));
      return addListener(key, setValue);
    }, [key]);
    return [value, onChange];
  }
}
const useStorage = hookFactory(getJsonStorage(window.localStorage))
export default useStorage;