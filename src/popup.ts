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
        createTemplateButton.addEventListener('click', () => {});
    };
}

window.onload = async () => {
    new SalesforceComponent('sf-component', true);
};