"use strict";
class SalesforceCase {
    constructor() {
        this.createEsdButton = () => {
            try {
                // Create ESD button
                this.esdButton = document.createElement('li');
                this.esdButton.innerHTML = '<button id="create-esd-btn" class="slds-global-actions__item" style="background-color: rgba(0,0,0,0); border-radius: 5px; font-weight: bold">ESD</button>';
                this.esdButton.addEventListener('click', this.createTemplate);
                // Get global menu
                const globalMenuNode = document.getElementsByClassName('slds-global-actions')[0];
                // Insert button
                globalMenuNode.insertBefore(this.esdButton, globalMenuNode.childNodes[1]);
            }
            catch (error) {
                console.error(error);
            }
        };
        this.createLayer0HubButton = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            try {
                // Create Layer0 Hub button
                this.layer0HubButton = document.createElement('li');
                this.layer0HubButton.innerHTML = '<button id="open-layer0-hub-btn" class="slds-button slds-button_neutral">Layer0 Hub</button>';
                this.layer0HubButton.addEventListener('click', this.openLayer0Hub);
                // Get case menu
                const caseMenuNode = document.getElementsByClassName('slds-button-group-list').item(0);
                // Get platform type
                const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div[aria-expanded="true"]')[0];
                const platformType = (_l = (_k = (_j = (_h = (_g = (_f = (_e = (_d = (_c = (_b = (_a = activeTab === null || activeTab === void 0 ? void 0 : activeTab.getElementsByClassName('slds-form')[3]) === null || _a === void 0 ? void 0 : _a.childNodes[0]) === null || _b === void 0 ? void 0 : _b.childNodes[1]) === null || _c === void 0 ? void 0 : _c.childNodes[0]) === null || _d === void 0 ? void 0 : _d.childNodes[0]) === null || _e === void 0 ? void 0 : _e.childNodes[0]) === null || _f === void 0 ? void 0 : _f.childNodes[0]) === null || _g === void 0 ? void 0 : _g.childNodes[1]) === null || _h === void 0 ? void 0 : _h.childNodes[0]) === null || _j === void 0 ? void 0 : _j.childNodes[0]) === null || _k === void 0 ? void 0 : _k.childNodes[0]) === null || _l === void 0 ? void 0 : _l.textContent;
                const layer0 = typeof platformType === 'string' && platformType.length > 0 ? true : false;
                this.rda = platformType === null || platformType === void 0 ? void 0 : platformType.split('.').splice(1).join('.');
                // Insert button
                if (layer0) {
                    caseMenuNode === null || caseMenuNode === void 0 ? void 0 : caseMenuNode.insertBefore(this.layer0HubButton, caseMenuNode.childNodes[4]);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        this.deleteButtons = () => {
            try {
                if (this.esdButton) {
                    this.esdButton.remove();
                }
                if (this.layer0HubButton) {
                    this.layer0HubButton.remove();
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        this.openLayer0Hub = () => {
            // Open Layer0 Hub & copy RDA to clipboard
            if (this.rda) {
                navigator.clipboard.writeText(this.rda).then(() => {
                    window.open('https://hub.admin.prod.a0core.net/orgs', '_blank', 'noopener');
                });
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
        this.createTemplate = () => {
            try {
                // Diable button
                this.loading();
                // Fetch values for file name
                let fileName = this.fetchValues();
                // Get Google API token
                chrome.runtime.sendMessage({ path: '/api/create-template', fileName: fileName }, (res) => {
                    if (res.newCopyId) {
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
        };
        this.loading = () => {
            try {
                const button = document.getElementById('create-esd-btn');
                button.disabled = true;
                button.innerHTML = 'loading...';
                setTimeout(() => {
                    this.deleteButtons();
                    this.createEsdButton();
                    this.createLayer0HubButton();
                }, 10000, button);
            }
            catch (error) {
                console.error(error);
            }
        };
    }
}
const salesforceCase = new SalesforceCase();
chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req && req.salesforce && req.caseView) {
        setTimeout(() => {
            salesforceCase.deleteButtons();
            salesforceCase.createEsdButton();
            salesforceCase.createLayer0HubButton();
            res("200 Success");
        }, 3000);
    }
    else {
        salesforceCase.deleteButtons();
        res("200 Success");
    }
});
