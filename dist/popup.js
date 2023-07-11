"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SalesforceComponent {
    constructor(newElementId, insertAtStart) {
        this.templateElement = document.getElementById('salesforce-template');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = newElementId;
        this.loadElement(insertAtStart);
    }
    ;
    loadElement(insertAtBegining) {
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
        const createTemplateButton = document.getElementById('create-template-btn');
        createTemplateButton.addEventListener('click', () => { });
    }
    ;
}
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    new SalesforceComponent('sf-component', true);
});
//# sourceMappingURL=popup.js.map