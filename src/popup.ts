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

    private async checkForFolder(authToken: string): Promise<void> {
        const queryString: string = encodeURIComponent('mimeType="application/vnd.google-apps.folder" and parents="root" and name="ESD Templates" and trashed=false');

        try {
            const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${queryString}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            if (data && data.files && data.files.length > 0) {
                console.log("Data: ", data);
            }
        } catch (err: any) {
            console.error(err);
            return err;
        }
       
    }

    private async createESDTemplateFolder() {
        
    }

    private async createTemplate() {
        console.log("CREATE TEMPLATE 2")
        let templateId: string
        
        const token: string = (await chrome.identity.getAuthToken({interactive: true})).token;
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
    }
}

window.onload = async () => {
    new SalesforceComponent('sf-component', true);
};