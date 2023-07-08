var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const checkForFolder = (authToken) => __awaiter(this, void 0, void 0, function* () {
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
            console.log("Found Folder: ", data.files[0]);
            return data.files[0].id;
        }
        else {
            return undefined;
        }
    }
    catch (err) {
        if (typeof err === 'object') {
            throw new Error(JSON.stringify(err));
        }
        else {
            throw new Error(err);
        }
    }
});
const createFolder = (authToken) => __awaiter(this, void 0, void 0, function* () {
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
        /**** PICKUP WORK HERE ****/
        console.log("Data; New Folder Id: ", data.id);
        return data.id;
    }
    catch (err) {
        if (typeof err === 'object') {
            throw new Error(JSON.stringify(err));
            console.error(err);
        }
        else {
            throw new Error(err);
        }
    }
});
const createFile = (authToken, folder, fileName) => __awaiter(this, void 0, void 0, function* () {
    console.log("Create File: Folder ID: ", folder);
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
        const res = yield fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', request);
        const data = yield res.json();
        if (data.id) {
            console.log("Data; New Copy's ID: ", data.id);
            return data.id;
        }
        else {
            throw new Error(data);
        }
    }
    catch (err) {
        if (typeof err === 'object') {
            throw new Error(err);
        }
        else {
            throw new Error(err);
        }
    }
});
chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/services/create-template' && req.fileName) {
        chrome.identity.getAuthToken({ interactive: true }, (token) => __awaiter(this, void 0, void 0, function* () {
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
        }));
        return true;
    }
});
//# sourceMappingURL=service.js.map