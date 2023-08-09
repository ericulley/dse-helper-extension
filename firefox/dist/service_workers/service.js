"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**********************
 * Google Authorization
 **********************/
const authorize = () => __awaiter(void 0, void 0, void 0, function* () {
    const redirectURL = browser.identity.getRedirectURL();
    console.log("DSE Helper Extension's Redirect URL: ", redirectURL);
    const clientID = '30946108485-o0ftk7a4u0qvghgv3ve52jbudljj3rsr.apps.googleusercontent.com';
    const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/drive"];
    let authURL = "https://accounts.google.com/o/oauth2/auth";
    authURL += `?client_id=${clientID}`;
    authURL += `&response_type=token`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;
    const response = yield browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL,
    });
    const responseParams = response.split('#')[1].split('&');
    let authResponse = {};
    responseParams.forEach((param) => {
        const key = param.split('=')[0];
        const val = param.split('=')[1];
        authResponse[key] = val;
    });
    return authResponse.access_token ? authResponse.access_token : undefined;
});
/*******************
 * Google Drive API
 *******************/
const checkForFolder = (authToken) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };
    const queryString = encodeURIComponent('mimeType="application/vnd.google-apps.folder" and parents="root" and name="ESD Templates" and trashed=false');
    try {
        const res = yield fetch(`https://www.googleapis.com/drive/v3/files?q=${queryString}`, request);
        const data = yield res.json();
        if (data.files && data.files.length > 0 && data.files[0].name === 'ESD Templates') {
            return data.files[0].id;
        }
        else {
            return undefined;
        }
    }
    catch (error) {
        console.error(error);
    }
});
const createFolder = (authToken) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        method: 'POST',
        body: JSON.stringify({
            mimeType: 'application/vnd.google-apps.folder',
            name: 'ESD Templates',
            parents: ['root']
        }),
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = yield fetch('https://www.googleapis.com/drive/v3/files', request);
        const data = yield res.json();
        if (data && data.id) {
            return data.id;
        }
        else {
            throw new Error(`Error: ${data}`);
        }
    }
    catch (error) {
        console.error(error);
        return error;
    }
});
const createFile = (authToken, folder, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const request = {
        method: 'POST',
        body: JSON.stringify({
            name: fileName,
            parents: [folder],
            permissionIds: ['01913879928154247020k']
        }),
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };
    try {
        const res = yield fetch('https://www.googleapis.com/drive/v3/files/1QhUE0aoPeMmDTJJGVVkzA3ugHGWHeXmGtE1oKjpaO6I/copy?supportsAllDrives=true', request);
        const data = yield res.json();
        if (data.id) {
            return data.id;
        }
        else {
            throw new Error(data);
        }
    }
    catch (error) {
        console.error(error);
        return error;
    }
});
/*******************
 * Listeners
 *******************/
browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/services/create-template' && req.fileName) {
        try {
            authorize().then((token) => __awaiter(void 0, void 0, void 0, function* () {
                if (token) {
                    let newCopyId;
                    // Check if 'ESD Templates' folder already exists
                    let folderId = yield checkForFolder(token);
                    // If no folder was found, create one.
                    if (!folderId) {
                        folderId = (yield createFolder(token));
                    }
                    // Create template in folder
                    if (folderId) {
                        newCopyId = (yield createFile(token, folderId, req.fileName));
                        res({ newCopyId: newCopyId });
                    }
                    else {
                        throw new Error("Error: No Folder ID");
                    }
                }
                else {
                    throw new Error("401 Unauthorized: No Token");
                }
            }));
            return true;
        }
        catch (error) {
            console.error(error);
        }
    }
});
browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/api/os-login-autoclose' && req.autoclose) {
        browser.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
            console.log("Tab: ", tab);
            if (tab && tab.id) {
                browser.tabs.remove(tab.id);
            }
        });
    }
});
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId && changeInfo.status && changeInfo.status === 'complete' && tab.url) {
        // Listen for Salesforce Case pages
        if (tab.url.includes('https://auth0.lightning.force.com/lightning/')) {
            let body = {};
            const path = tab.url.split('/');
            if (path[4] === 'r' &&
                path[5] === 'Case' &&
                path[7] === 'view') {
                body = {
                    salesforce: true,
                    caseView: true
                };
            }
            else {
                body = {
                    salesforce: true,
                    caseView: false
                };
            }
            try {
                browser.tabs.sendMessage(tabId, body);
            }
            catch (error) {
                console.error(error);
            }
        }
        // Listen for Layer0 Hub pages
        if (tab.url.includes('https://hub.admin.prod.a0core.net/orgs/detail/')) {
            try {
                browser.tabs.sendMessage(tabId, {
                    layer0HubDetailsPage: true
                });
            }
            catch (error) {
                console.error(error);
            }
        }
    }
});
