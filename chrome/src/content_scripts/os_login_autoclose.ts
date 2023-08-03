
const path =  window.location.pathname;
const query = window.location.search;

if (path.length <= 1 && query.length <= 1) {
    chrome.runtime.sendMessage({path: '/api/os-login-autoclose', autoclose: true}, (res) => {
        console.log(res);
    });
}

