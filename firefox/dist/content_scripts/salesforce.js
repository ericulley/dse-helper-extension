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
            try {
                // Create Layer0 Hub button
                this.layer0HubButton = document.createElement('li');
                this.layer0HubButton.innerHTML = '<button id="open-layer0-hub-btn" class="slds-button slds-button_neutral">Layer0 Hub</button>';
                this.layer0HubButton.addEventListener('click', () => { window.open('https://hub.admin.prod.a0core.net/orgs', '_blank', 'noopener'); });
                // Get case menu
                const caseMenuNode = document.getElementsByClassName('slds-button-group-list').item(0);
                // Get platform type
                const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div[aria-expanded="true"]')[0];
                const platformType = activeTab.getElementsByClassName('slds-form')[3].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
                const layer0 = typeof platformType === 'string' && platformType.length > 0 ? true : false;
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
                browser.runtime.sendMessage({ path: '/api/create-template', fileName: fileName }).then((res) => {
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
browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req && req.salesforce && req.caseView) {
        setTimeout(() => {
            salesforceCase.deleteButtons();
            salesforceCase.createEsdButton();
            salesforceCase.createLayer0HubButton();
            res("200 Success");
        }, 5000);
    }
    else {
        salesforceCase.deleteButtons();
        res("200 Success");
    }
});
