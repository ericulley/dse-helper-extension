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
importScripts('googleApi.js');
/*******************
 * Listeners
 *******************/
chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/api/create-template' && req.fileName) {
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
/*******************
 * Triggers
 *******************/
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId && changeInfo.status && changeInfo.status === 'complete' && tab.url) {
        // Listen for Layer0 Hub pages
        if (tab.url.includes('https://hub.admin.prod.a0core.net/orgs/detail/')) {
            try {
                chrome.tabs.sendMessage(tabId, {
                    layer0HubDetailsPage: true
                });
            }
            catch (error) {
                console.error(error);
            }
        }
        // Listen for Salesforce Case pages
        else if (tab.url.includes('https://auth0.lightning.force.com/lightning/')) {
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
                chrome.tabs.sendMessage(tabId, body);
            }
            catch (error) {
                console.error(error);
            }
        }
    }
});
