interface Req {
    method: 'GET' | 'POST',
    headers: {
        "Authorization": string,
        "Content-Type": string
    }, 
    body?: string
}

class SalesforceComponent {
    private templateElement
    private hostElement 
    private element

    constructor(newElementId: string, insertAtStart: boolean,) {
        this.templateElement = document.getElementById('salesforce-template')! as HTMLTemplateElement;

        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);

        this.element = importedNode.firstElementChild;
        this.element.id = newElementId;

        this.loadElement(insertAtStart);
    };

    private loadElement(insertAtBegining: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
        const createTemplateButton = document.getElementById('create-template-btn') as HTMLButtonElement;
        createTemplateButton.addEventListener('click', this.createTemplate);
    };

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

    private createFile = async (authToken: string, folder: string): Promise<string> => {
        console.log("Create File: Folder ID: ", folder)
        try {
            const res = await fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({parents: [`${folder}`]}) 
            })
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

    private createTemplate = async () => {
        console.log("CREATE TEMPLATE START")
        let folderId: string | undefined
        let newCopyId: string;
        
        // Get Google API Token
        const token: string = (await chrome.identity.getAuthToken({interactive: true})).token;
        console.log("Token: ", token);

        // Check if 'ESD Templates' folder already exists
        folderId = await this.checkForFolder(token) as unknown as string;

        // If no folder was found, create one.
        if (!folderId) {
            folderId = await this.createFolder(token)as unknown as string;
        } 
        
        // Create template in folder
        if (folderId) {
            newCopyId = await this.createFile(token, folderId) as unknown as string;
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

window.onload = async () => {
    new SalesforceComponent('sf-component', true);
};