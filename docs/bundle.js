(()=>{"use strict";var r=[[],[],[],[],[],[],[],[]],n=function n(){var t=Math.floor(8*Math.random());if(t<=3){if(r[t].length>=7)return n()}else if(r[t].length>=6)return n();return t};(function(r){for(var n=r.length-1;n>0;n--){var t=Math.floor(Math.random()*(n+1)),a=[r[t],r[n]];r[n]=a[0],r[t]=a[1]}return r})(Array.from(52).map((function(r,n){return n+1}))).map((function(t,a){var e=n();r[e].push(number)}))})();