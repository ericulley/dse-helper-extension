class SalesforceCase {

    esdButton?: HTMLElement;

    // Add button to menu
    createEsdButton = () => {
        try {
            // Create ESD button
            this.esdButton = document.createElement('li') as HTMLLIElement;
            this.esdButton.innerHTML = '<button id="create-esd-btn" class="slds-global-actions__item" style="background-color: rgba(0,0,0,0); border-radius: 5px; font-weight: bold">ESD</button>';
            this.esdButton.addEventListener('click', this.createTemplate);
            
            // Get global menu
            const globalMenuNode = document.getElementsByClassName('slds-global-actions')[0] as HTMLElement;
            
            // Insert button
            globalMenuNode.insertBefore(this.esdButton, globalMenuNode.childNodes[1]);

        } catch (error) {
            console.error(error);
        }
        
    }

    // Get the case values for ESD
    private fetchValues = (): string | undefined => {
        try {
            // Get active Salesforce tab
            const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div.active')[0];

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
        } catch (error) {
            console.error(error);
        }
    }

    // Create ESD template
    private createTemplate = () => {
        try {
            // Diable button
            this.loading();
            
            // Fetch values for file name
            let fileName = this.fetchValues();
            
            // Get Google API token
            chrome.runtime.sendMessage({path: '/api/create-template', fileName: fileName}, (res) => {
                if (res.newCopyId) {
                    window.open(`https://docs.google.com/document/d/${res.newCopyId}/edit`, '_blank');
                } else {
                    throw new Error("Error: No NewCopy ID");
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Add Layer0 Hub link
    checkRootDomainAuthority = () => {
        // Check for Root Domain Authority value
        const checkForPlatform = (): [HTMLElement, string] | undefined => {
            const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div.active')[0];

            const rdaNode = activeTab?.getElementsByClassName('slds-form')[3]?.childNodes[0]?.childNodes[1]?.childNodes[0]?.childNodes[0]?.childNodes[0]?.childNodes[0]?.childNodes[1]?.childNodes[0]?.childNodes[0]?.childNodes[0] as HTMLElement;

            const domain: string = rdaNode.innerText;
            if (domain && domain.length > 0) {
                return [rdaNode, domain];
            } else {
                return undefined;
            } 
        }

        // Create link to Layer0 Hub and copy domain to clipboard
        const createLayer0HubLink = (rda: [HTMLElement, string]) => {
            rda[0].innerHTML = `<a>${rda[1]}</a>`;
            rda[0].addEventListener('click', () => {
                // Trim off 'config'
                const domain = rda[1].split('.').splice(1).join('.');
                navigator.clipboard.writeText(domain).then(() => {
                    window.open('https://hub.admin.prod.a0core.net/orgs', '_blank', 'noopener');
                });
            })
        }

        let rootDomainAuthority: [HTMLElement, string] | undefined;
        // Periodically check for RDA value and add link
        try {
            setTimeout(() => {
                rootDomainAuthority = checkForPlatform();
                if (rootDomainAuthority) {
                    createLayer0HubLink(rootDomainAuthority);
                } else {
                    setTimeout(() => {
                        rootDomainAuthority = checkForPlatform();
                        if (rootDomainAuthority) {
                            createLayer0HubLink(rootDomainAuthority);
                        } else {
                            setTimeout(() => {
                                rootDomainAuthority = checkForPlatform();
                                if (rootDomainAuthority) {
                                    createLayer0HubLink(rootDomainAuthority);
                                } else {
                                    console.log('No Root Domain Authority found');
                                }
                            }, 3000);
                        }
                    }, 3000);
                }
            }, 3000)
        } catch (error) {
            console.error(error);
        }
    }

    // Remove all buttons
    deleteButtons = () => {
        try {
            if (this.esdButton) {
                this.esdButton.remove();
            } 
        } catch (error) {
            console.error(error);
        }
    }

    // Temporarily disable ESD button
    private loading = () => {
        try {
            const button = document.getElementById('create-esd-btn') as HTMLButtonElement;
            button.disabled = true;
            button.innerHTML = 'loading...';
            setTimeout(() => {
                this.deleteButtons();
                this.createEsdButton();
            }, 10000, button)
        } catch (error) {
            console.error(error);
        }
    }
}

const salesforceCase = new SalesforceCase();

chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req && req.salesforce && req.caseView) {
        setTimeout(() => {
            salesforceCase.deleteButtons();
            salesforceCase.createEsdButton();
            salesforceCase.checkRootDomainAuthority();
            res("200 Success");
        }, 3000);
    } else {
        salesforceCase.deleteButtons();
        res("200 Success");
    }
})