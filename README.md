# 基础用法（localStorage）
```javascript
import React from 'react';
import useStorage from 'rh-storage'
function Userinfo(){
    const [ useinfo ] = useStorage('userinfo');
    return JSON.stringify(userinfo);
}
function Login(){
    const [ ,setUserinfo ] = useStorage('userinfo');
    return <div onClick={()=>setUserinfo({ token:'abc', nickname:'def' })}>Login</div>
}
function Layout(){
    return <>
        <Userinfo />
        <Login />
    </>
}
```
# 扩展用法（sessionStorage）
```javascript
import { hookFactory } from 'rh-storage'
const useStorage = hookFactory(window.sessionStorage);
export default useStorage
```

# 复杂用法（crypto）
```javascript
import AES from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';
const AESKey = 'www.idler8.com';
function getCryptoStorage(Storage){
    return {
        getItem(key){
            try {
                return AES.decrypt(Storage.getItem(key), AESKey).toString(UTF8);
            } catch (e) {
                return null;
            }
        },
        setItem(key, value){
            Storage.setItem(key,AES.encrypt(value, AESKey).toString())
        },
        removeItem(key){
            Storage.removeItem(key)
        },
        clear(){
            Storage.clear();
        }
    }
}
const cryptoStorage = getCryptoStorage(window.sessionStorage)
export default cryptoStorage;
```
# 多页面同步（storage event）
```javascript
import { hookFactory, getListener, addWindowListener, CLEAR} from 'rh-storage'
const listener = getListener();
const [,updateValue] = listener;
addWindowListener({
    create:(key, value)=>updateValue(key, value),
    update:(key, value)=>updateValue(key, value),
    remove:(key)=>updateValue(key),
    clear:()=>updateValue(CLEAR),
})
const useStorage = hookFactory(window.localStorage, listener);
export default useStorage
```