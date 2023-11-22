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
        const checkForPlatform = (): [HTMLElement, string?, string?, string?] | undefined => {
            const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div.active')[0];

            // Get Tenant
            const tenant = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[5].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent as string;

            // Get Host Enviroment
            const hostEnvironment = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[6].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent as string;

            // Get for Root Domain Authority
            const rdaNode = activeTab?.getElementsByClassName('slds-form')[3].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0] as HTMLElement;

            const rdaDomain: string = rdaNode.innerText;

            if (rdaDomain && rdaDomain.length > 0) {
                return [rdaNode, rdaDomain, undefined, undefined];
            } else if (!rdaDomain && hostEnvironment && tenant) {
                return [rdaNode, undefined, hostEnvironment, tenant]
            } else {
                return undefined;
            } 
        }

        // Create link to Layer0 Hub and copy domain to clipboard
        const createLayer0HubLink = (rda: [HTMLElement, string?, string?, string?]) => {
            const [rdaNode, rdaDomain, hostEnvironment, tenant] = rda;

            if (rdaNode.getAttribute('listener') !== 'true') {
                if (rdaNode && rdaDomain) {
                    rdaNode.innerHTML = `<a>${rdaDomain}</a>`;
                    rdaNode.addEventListener('click', () => {
                        // Trim off 'config'
                        const domain = rdaDomain.split('.').splice(1).join('.');
                        navigator.clipboard.writeText(domain).then(() => {
                            window.open('https://hub.admin.prod.a0core.net/orgs', '_blank', 'noopener');
                        });
                    })
                    rdaNode.setAttribute('listener', 'true');
                // Create link to public cloud OpenSearch logs
                } else if (rdaNode && !rdaDomain && tenant && hostEnvironment && Object.keys(publicCloudEnvironments).includes(hostEnvironment)) {
                    const formattedTenant = tenant.split('@')[0];
                    rdaNode.innerHTML = `<a>${hostEnvironment}</a>`;
                    rdaNode.addEventListener('click', () => {
                        window.open(`${publicCloudEnvironments[hostEnvironment]}?_a=(columns:!(log_type,operation,res.status_code,req.ip,space,tenant),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:logs_server,key:space,negate:!f,params:(query:${hostEnvironment}),type:phrase),query:(match_phrase:(space:${hostEnvironment}))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:logs_server,key:tenant,negate:!f,params:(query:${formattedTenant}),type:phrase),query:(match_phrase:(tenant:${formattedTenant})))),index:logs_server,interval:auto,query:(language:kuery,query:''),sort:!())&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))`, '_blank', 'noopener');
    
                    })
                }
            }
        }

        let rootDomainAuthority: [HTMLElement, string?, string?, string?] | undefined;
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

// For layer0 public cloud OpenSearch links
const publicCloudEnvironments: {
    [key: string]: string
  } = {
    "prod-au-1": "https://logs.admin.pop-aws-ap-southeast-2.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-eu-1": "https://logs.admin.pop-aws-eu-central-1.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-eu-2": "https://logs.admin.pop-aws-eu-west-1.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-jp-1": "https://logs.admin.pop-aws-ap-northeast-1.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-uk-1": "https://logs.admin.pop-aws-eu-west-2.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-us-1": "https://logs.admin.pop-aws-us-west-2.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-us-3": "https://logs.admin.pop-aws-us-east-2.pop.prod.a0core.net/_dashboards/app/discover#/",
    "prod-us-4": "https://logs.admin.pop-aws-us-west-2.pop.prod.a0core.net/_dashboards/app/discover#/"
}