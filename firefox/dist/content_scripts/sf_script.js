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
class SalesforceCase {
    constructor() {
        this.createEsdButton = () => {
            try {
                // Create button
                this.button = document.createElement('li');
                this.button.innerHTML = '<button id="create-esd-btn" class="slds-global-actions__item" style="background-color: rgba(0,0,0,0); border-radius: 5px; font-weight: bold">ESD</button>';
                this.button.addEventListener('click', this.createTemplate);
                // Get header menu
                const globalMenuNode = document.getElementsByClassName('slds-global-actions')[0];
                // Insert button
                globalMenuNode.insertBefore(this.button, globalMenuNode.childNodes[1]);
            }
            catch (error) {
                console.error(error);
            }
        };
        this.deleteEsdButton = () => {
            try {
                if (this.button) {
                    this.button.remove();
                }
            }
            catch (error) {
                console.error(error);
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
                const layer0 = typeof platformType === 'string' && platformType.length > 0 ? true : false;
                return `ESDTemplate?casenumber=${caseNumber}&tenant=${tenant}&priority=${priority}&layer0=${layer0}`;
            }
            catch (error) {
                console.error(error);
            }
        };
        this.createTemplate = () => __awaiter(this, void 0, void 0, function* () {
            try {
                // Diable button
                this.loading();
                // Fetch values for file name
                let fileName = this.fetchValues();
                // Get Google API token
                browser.runtime.sendMessage({ path: '/services/create-template', fileName: fileName }).then((res) => {
                    if (res === null || res === void 0 ? void 0 : res.newCopyId) {
                        window.open(`https://docs.google.com/document/d/${res.newCopyId}/edit`, '_blank');
                    }
                    else {
                        throw new Error("Error: No NewCopy ID");
                    }
                });
            }
            catch (error) {
                console.error(error);
            }
        });
        this.loading = () => {
            try {
                const button = document.getElementById('create-esd-btn');
                button.disabled = true;
                button.innerHTML = 'loading...';
                setTimeout(() => {
                    this.deleteEsdButton();
                    this.createEsdButton();
                }, 10000, button);
            }
            catch (error) {
                console.error(error);
            }
        };
    }
}
const salesforceCase = new SalesforceCase();
browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req && req.salesforce && req.caseView) {
        setTimeout(() => {
            salesforceCase.deleteEsdButton();
            salesforceCase.createEsdButton();
            res("200 Success");
        }, 3000);
    }
    else {
        salesforceCase.deleteEsdButton();
        res("200 Success");
    }
});
