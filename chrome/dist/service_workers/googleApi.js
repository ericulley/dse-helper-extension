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
