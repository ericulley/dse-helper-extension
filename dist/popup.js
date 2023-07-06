var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SalesforceComponent {
    constructor(newElementId, insertAtStart) {
        this.checkForFolder = (authToken) => __awaiter(this, void 0, void 0, function* () {
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
        this.createFolder = (authToken) => __awaiter(this, void 0, void 0, function* () {
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
        this.createFile = (authToken, folder) => __awaiter(this, void 0, void 0, function* () {
            console.log("Create File: Folder ID: ", folder);
            try {
                const res = yield fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ parents: [`${folder}`] })
                });
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
        this.createTemplate = () => __awaiter(this, void 0, void 0, function* () {
            console.log("CREATE TEMPLATE START");
            let folderId;
            let newCopyId;
            // Get Google API Token
            const token = (yield chrome.identity.getAuthToken({ interactive: true })).token;
            console.log("Token: ", token);
            // Check if 'ESD Templates' folder already exists
            folderId = (yield this.checkForFolder(token));
            // If no folder was found, create one.
            if (!folderId) {
                folderId = (yield this.createFolder(token));
            }
            // Create template in folder
            if (folderId) {
                newCopyId = (yield this.createFile(token, folderId));
            }
            else {
                throw new Error("Error: No Folder ID");
            }
            if (newCopyId) {
                window.open(`https://docs.google.com/document/d/${newCopyId}/edit`, '_blank');
            }
            else {
                throw new Error("Error: No NewCopy ID");
            }
        });
        this.templateElement = document.getElementById('salesforce-template');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = newElementId;
        this.loadElement(insertAtStart);
    }
    ;
    loadElement(insertAtBegining) {
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
        const createTemplateButton = document.getElementById('create-template-btn');
        createTemplateButton.addEventListener('click', this.createTemplate);
    }
    ;
}
window.onload = () => __awaiter(this, void 0, void 0, function* () {
    new SalesforceComponent('sf-component', true);
});
//# sourceMappingURL=popup.js.map