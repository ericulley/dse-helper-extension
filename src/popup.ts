class SalesforceComponent {
    templateElement
    hostElement 
    element

    constructor(newElementId: string, insertAtStart: boolean,) {
        this.templateElement = document.getElementById('salesforce-template')! as HTMLTemplateElement;

        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true)

        this.element = importedNode.firstElementChild;
        this.element.id = newElementId;

        this.loadElement(insertAtStart);
    }

    private loadElement(insertAtBegining: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
        const createTemplateButton = document.getElementById('create-template-btn') as HTMLButtonElement;
        createTemplateButton.addEventListener('click', this.createTemplate);
    }

    private async createTemplate() {
        console.log("CLICK ME!")
        let templateId: string
        chrome.identity.getAuthToken({interactive: true}, async (token) => {
            console.log(token);
            const res = await fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({parents: ['root']}) 
            })
            const data = await res.json()
            console.log("Data: ", data.id);
            window.open(`https://docs.google.com/document/d/${data.id}/edit`, '_blank');
        });
    }
}

window.onload = () => {
    new SalesforceComponent('sf-component', true);
};