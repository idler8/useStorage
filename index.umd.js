!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).useStorage={},e.react)}(this,(function(e,t){"use strict";const n={},o=[];function r(e,t,r){localStorage[e]=JSON.stringify(t),n[e]=t,r||o.forEach((t=>t(e)))}function u(e){try{return n[e]||JSON.parse(localStorage[e])}catch(e){return null}}e.default=function(e){const[c,f]=t.useState(n[e]||(()=>n[e]=u(e))),s=t.useCallback((t=>{r(e,t)}),[e]);return t.useEffect((()=>{f(n[e]);const t=t=>t===e&&f(n[e]);return o.push(t),()=>o.splice(o.indexOf(t),1)}),[e]),[c,s]},e.getStorage=u,e.setStorage=r,Object.defineProperty(e,"__esModule",{value:!0})}));
