interface Req {
    method: 'GET' | 'POST',
    headers: {
        "Authorization": string,
        "Content-Type": string
    }, 
    body?: string
}

class SalesforceCase {

    constructor() {
        this.createEsdButton();       
    }

    private createEsdButton = (): void => {
        try {
            // Create button
            const button = document.createElement('li') as HTMLLIElement;
            button.innerHTML = '<button id="create-esd-btn" class="slds-global-actions__item" style="background-color: rgba(0,0,0,0); border-radius: 5px; font-weight: bold">ESD</button>'
            button.addEventListener('click', this.createTemplate);
            
            // Get header menu
            const globalMenuNode = document.getElementsByClassName('slds-global-actions')[0];
            
            // Insert button
            globalMenuNode.insertBefore(button, globalMenuNode.childNodes[1]);
        } catch (err: any) {
            throw new Error(err);
        }
        
    }

    private fetchValues = (): string => {
        try {
            // Get active Salesforce tab
            const activeTab = document.getElementsByClassName('split-right')[0].querySelectorAll('section.tabContent.oneConsoleTab.active[aria-expanded="true"] > div[aria-expanded="true"]')[0]

            // Get case number
            const caseNumber = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
        
            // Get tenant name
            const tenant = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[5].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;

            // Get priority
            const priority = activeTab.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[7].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;

            // Get platform type
            const platformType = activeTab.getElementsByClassName('slds-form')[3].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
            const layer0 = typeof platformType === 'string' && platformType.length > 0 ? true : false;

            return `ESDTemplate?case:${caseNumber}&tenant=${tenant}&priority=${priority}&layer0=${layer0}`
        } catch (err: any) {
            throw new Error(err);
        }
        
    }

    private createTemplate = async () => {
        console.log("CREATE TEMPLATE START")
        let token: string
        let fileName: string;
        let folderId: string | undefined;
        let newCopyId: string;

        // Fetch values for file name
        fileName = this.fetchValues()
        
        // Get Google API token
        chrome.runtime.sendMessage({path: '/services/create-template', fileName: fileName}, (res) => {
            console.log("Response:New File ID: ", res)
            if (res.newCopyId) {
                window.open(`https://docs.google.com/document/d/${res.newCopyId}/edit`, '_blank');
            } else {
                throw new Error("Error: No NewCopy ID");
            }
        });
    }
}

setTimeout(() => {
    const supportCase = new SalesforceCase();
}, 10000);