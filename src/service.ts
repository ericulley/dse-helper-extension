chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.body === 'get-oauth-token') {
        chrome.identity.getAuthToken({interactive: true}, (token) => {
            res(token);
        });
        return true;
    } 
});