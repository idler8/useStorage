```javascript
import React from 'react';
import useStorage from 'rh-storage'
function Userinfo(){
    const [ useinfo ] = useStorage('userinfo');
    return JSON.stringify(userinfo);
}
function Login(){
    const [ useinfo ,setUserinfo ] = useStorage('userinfo');
    return <div onClick={()=>setUserinfo({token:'abc',nickname:'def'})}>Login</div>
}
function Layout(){
    return <>
        <Userinfo />
        <Login />
    </>
}
```