class SalesforceCase {
    constructor() {
        try {
            // Get tenant name
            this.tenant = document.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[5].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
            // Get priority
            this.priority = document.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[7].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
        }
        catch (error) {
            console.error(error);
        }
    }
}
setTimeout(() => {
    const supportCase = new SalesforceCase();
    console.log("CASE DETAILS: ", supportCase);
}, 20000);
//# sourceMappingURL=sf-script.js.map