chrome.runtime.onMessage.addListener((req, _sender, res) => {
    // 2. A page requested user data, respond with a copy of `user`
    if (req.body === 'get-oauth-token') {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            console.log("Token: ", token);
            res(token);
        });
        return true;
    }
});
//# sourceMappingURL=service.js.map