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
    checkForFolder(authToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = encodeURIComponent('mimeType="application/vnd.google-apps.folder" and parents="root" and name="ESD Templates" and trashed=false');
            try {
                const res = yield fetch(`https://www.googleapis.com/drive/v3/files?q=${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = yield res.json();
                if (data && data.files && data.files.length > 0) {
                    console.log("Data: ", data);
                }
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    createESDTemplateFolder() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    createTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("CREATE TEMPLATE 2");
            let templateId;
            const token = (yield chrome.identity.getAuthToken({ interactive: true })).token;
            console.log("Token: ", token);
            // Check is 'ESD Templates' folder already exists
            this.checkForFolder(token);
            // const res = await fetch('https://www.googleapis.com/drive/v3/files?supportsAllDrives=true', {
            //     method: 'POST', 
            //     body: {
            //         memeType: 'application/vnd.google-apps.folder'
            //     },
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({parents: ['root']}) 
            // })
            // const data = await res.json()
            // console.log("Data: ", data.id);
            // window.open(`https://docs.google.com/document/d/${data.id}/edit`, '_blank');
            // const res = await fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', {
            //     method: 'POST', 
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({parents: ['root']}) 
            // })
            // const data = await res.json()
            // console.log("Data: ", data.id);
            // window.open(`https://docs.google.com/document/d/${data.id}/edit`, '_blank');
        });
    }
}
window.onload = () => __awaiter(this, void 0, void 0, function* () {
    new SalesforceComponent('sf-component', true);
});
//# sourceMappingURL=popup.js.map