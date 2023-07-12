"use strict";
const path = window.location.pathname;
const query = window.location.search;
if (path === '/' && !query) {
    chrome.runtime.sendMessage({ path: '/api/os-login-autoclose', autoclose: true }, (res) => {
        console.log(res);
    });
}
//# sourceMappingURL=os_login_autoclose.js.map