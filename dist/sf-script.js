var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SalesforceCase {
    constructor() {
        this.createEsdButton = () => {
            try {
                // Create button
                const button = document.createElement('li');
                button.innerHTML = '<button id="create-esd-btn" class="slds-global-actions__item" style="background-color: rgba(0,0,0,0); border-radius: 5px; font-weight: bold">ESD</button>';
                button.addEventListener('click', this.createTemplate);
                // Get header menu
                const globalMenuNode = document.getElementsByClassName('slds-global-actions')[0];
                // Insert button
                globalMenuNode.insertBefore(button, globalMenuNode.childNodes[1]);
            }
            catch (err) {
                throw new Error(err);
            }
        };
        this.fetchValues = () => {
            try {
                // Get active Salesforce tab
                const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div[aria-expanded="true"]')[0];
                // Get case number
                const caseNumber = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
                // Get tenant name
                const tenant = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[5].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
                // Get priority
                const priority = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[7].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
                // Get platform type
                const platformType = activeTab.getElementsByClassName('slds-form')[3].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
                const layer0 = typeof platformType === 'string' ? true : false;
                return `ESDTemplate?case:${caseNumber}&tenant=${tenant}&priority=${priority}&layer0=${layer0}`;
            }
            catch (err) {
                throw new Error(err);
            }
        };
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
        this.createFile = (authToken, folder, fileName) => __awaiter(this, void 0, void 0, function* () {
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
        this.getAPIToken = () => __awaiter(this, void 0, void 0, function* () {
            let token = '';
            const res = yield chrome.runtime.sendMessage({ body: 'get-oauth-token' });
            console.log("RESPONSE: ", res);
            token = res.token;
            return token;
        });
        this.createTemplate = () => __awaiter(this, void 0, void 0, function* () {
            console.log("CREATE TEMPLATE START");
            let token;
            let fileName;
            let folderId;
            let newCopyId;
            // Get Google API token
            chrome.runtime.sendMessage({ body: 'get-oauth-token' }, (res) => {
                console.log("Token 2: ", res);
                token = res;
            });
            // Fetch values for file name
            fileName = this.fetchValues();
            // Check if 'ESD Templates' folder already exists
            folderId = (yield this.checkForFolder(token));
            // If no folder was found, create one.
            if (!folderId) {
                folderId = (yield this.createFolder(token));
            }
            // Create template in folder
            if (folderId) {
                newCopyId = (yield this.createFile(token, folderId, fileName));
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
        this.createEsdButton();
    }
}
setTimeout(() => {
    const supportCase = new SalesforceCase();
}, 10000);
//# sourceMappingURL=sf-script.js.map