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
import { hookFactory, getWindowStorage } from 'rh-storage'
const useStorage = hookFactory(getWindowStorage(window.sessionStorage));
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