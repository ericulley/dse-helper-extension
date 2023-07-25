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
/*******************
 *
 * Helper Functions
 *
 *******************/
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
            parents: [folder]
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
 *
 * Message Listeners
 *
 *******************/
chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/services/create-template' && req.fileName) {
        try {
            chrome.identity.getAuthToken({ interactive: true }, (token) => __awaiter(void 0, void 0, void 0, function* () {
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
                    }
                    else {
                        throw new Error("Error: No Folder ID");
                    }
                    res({ newCopyId: newCopyId });
                }
                else {
                    throw new Error("401 Unauthorized: No Token");
                }
            }));
            return true;
        }
        catch (error) {
            console.error(error);
            res({ error: error });
            return false;
        }
    }
});
chrome.runtime.onMessage.addListener((req, _sender, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path === '/api/os-login-autoclose' && req.autoclose) {
        let [tab] = yield chrome.tabs.query({ active: true, lastFocusedWindow: true });
        console.log("Tab: ", tab);
        if (tab && tab.id) {
            chrome.tabs.remove(tab.id);
        }
    }
}));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status && changeInfo.status === 'complete' && tab.url && tab.url.includes('https://hub.admin.prod.a0core.net/orgs/detail/')) {
        chrome.tabs.sendMessage(tabId, {
            layer0HubDetailsPage: true
        });
    }
});
