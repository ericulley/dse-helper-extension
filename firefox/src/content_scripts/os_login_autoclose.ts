const path =  window.location.pathname;
const query = window.location.search;

/* 
*  Current Firefox versions seem to block this content 
*  script, possibly due to the Content-Security-Policy 
*  on the https://*.pop.prod.a0core.net domains. 
*/

console.log("Autoclose content script start");

if (path.length <= 1 && query.length <= 1) {
    browser.runtime.sendMessage({path: '/api/os-login-autoclose'}).then((res) => {
        console.log("Autoclose Reponse: ", res);
    });
}