const path =  window.location.pathname;
const query = window.location.search;

console.log("Autoclose content script start")

if (path.length <= 1 && query.length <= 1) {
    browser.runtime.sendMessage({path: '/api/os-login-autoclose'}).then((res) => {
        console.log("Autoclose Reponse: ", res);
    });
}