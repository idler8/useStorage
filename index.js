import { useCallback, useEffect, useState } from 'react';
export function addWindowListener(Storage){
  const handler = ({key,oldValue,newValue})=>{
    if(key === undefined) return Storage.clear();
    if(!newValue === undefined) return Storage.remove(key);
    if(!oldValue === undefined) return Storage.create(key,newValue);
    return Storage.update(key,newValue);
  }
  window.addEventListener('storage',handler)
  return ()=>window.removeEventListener(handler)
}
export function hookFactory(Storage){
  const Cache = {};
  const Listener = [];
  return function useStorage(key) {
    const [ value, setValue ] = useState(() => Storage.get(key));
    const updateValue = useCallback((value) => Storage.update(key, value), [ key ]);
    useEffect(() => {
      setValue(Storage.get(key));
      const handler = (keyChange) => keyChange === key && setValue(Cache[key]);
      Listener.push(handler);
      return () => Listener.splice(Listener.indexOf(handler), 1);
    }, [ key ]);
    return [ value, updateValue ];
  }
}
export function getWindowStorage(Storage){
  return {
    get(key){
      try {
        return JSON.parse(Storage.getItem(key));
      } catch (e) {
        return null;
      }
    },
    update(key,value){
      Storage.setItem(key, JSON.stringify(value))
    },
    remove(key){
      Storage.removeItem(key);
    },
    clear(){
      Storage.clear();
    },
    create(key, value){
      this.update(key,value)
    }
  }
}
const useStorage = hookFactory(getWindowStorage(localStorage))
export default useStorage;