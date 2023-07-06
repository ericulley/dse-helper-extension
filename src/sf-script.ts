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
            const layer0 = typeof platformType === 'string' ? true : false;

            return `ESDTemplate?case:${caseNumber}&tenant=${tenant}&priority=${priority}&layer0=${layer0}`
        } catch (err: any) {
            throw new Error(err);
        }
        
    }

    private checkForFolder = async (authToken: string): Promise<string | undefined> => {
        const request: Req = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        };
        const queryString: string = encodeURIComponent('mimeType="application/vnd.google-apps.folder" and parents="root" and name="ESD Templates" and trashed=false');

        try {
            const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${queryString}`, request);
            const data = await res.json();

            if (data.files && data.files.length > 0 && data.files[0].name === 'ESD Templates') {
                console.log("Found Folder: ", data.files[0]);
                return data.files[0].id;
            } else {
                return undefined
            }
        } catch (err: any) {
            if (typeof err === 'object'){
                throw new Error(JSON.stringify(err));
            } else {
                throw new Error(err);
            }
        }
       
    }

    private createFolder = async (authToken: string): Promise<string> => {
        const request: Req = {
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
            const res = await fetch('https://www.googleapis.com/drive/v3/files', request);
            const data = await res.json();

            /**** PICKUP WORK HERE ****/
            console.log("Data; New Folder Id: ", data.id);
            return data.id as string
           
        } catch (err: any) {
            if (typeof err === 'object'){
                throw new Error(JSON.stringify(err));
                console.error(err);
            } else {
                throw new Error(err);
            }
        }
       
    }

    private createFile = async (authToken: string, folder: string, fileName: string): Promise<string> => {
        console.log("Create File: Folder ID: ", folder)
        const request: Req = {
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
            const res = await fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', request)
            const data = await res.json()
            if (data.id) {
                console.log("Data; New Copy's ID: ", data.id);
                return data.id
            } else {
                throw new Error(data)
            }
        } catch (err: any) {
            if (typeof err === 'object'){
                throw new Error(err);
            } else {
                throw new Error(err);
            }
        }
    }

    private getAPIToken = async (): Promise<string> => {
        let token: string = ''
        const res = await chrome.runtime.sendMessage({body: 'get-oauth-token'});
        console.log("RESPONSE: ", res);
        token = res.token;
        return token;
    }

    private createTemplate = async () => {
        console.log("CREATE TEMPLATE START")
        let token: string
        let fileName: string;
        let folderId: string | undefined;
        let newCopyId: string;
        
        // Get Google API token
        chrome.runtime.sendMessage({body: 'get-oauth-token'}, (res) => {
            console.log("Token 2: ", res)
            token = res
        });

        // Fetch values for file name
        fileName = this.fetchValues()

        // Check if 'ESD Templates' folder already exists
        folderId = await this.checkForFolder(token) as unknown as string;

        // If no folder was found, create one.
        if (!folderId) {
            folderId = await this.createFolder(token)as unknown as string;
        } 
        
        // Create template in folder
        if (folderId) {
            newCopyId = await this.createFile(token, folderId, fileName) as unknown as string;
        } else {
            throw new Error("Error: No Folder ID");
        }

        if (newCopyId) {
            window.open(`https://docs.google.com/document/d/${newCopyId}/edit`, '_blank');
        } else {
            throw new Error("Error: No NewCopy ID");
        }
    }
}

setTimeout(() => {
    const supportCase = new SalesforceCase();
}, 10000);