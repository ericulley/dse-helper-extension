class SalesforceCase {

    tenant: string;
    priority: string;

    constructor() {
        try {
            // Get tenant name
            this.tenant = document.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[5].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;

            // Get priority
            this.priority = document.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[7].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
        } catch (error: unknown) {
            console.error(error);
        }
       
    }
}

console.log("CONTEXT SCRIPT STARTING...")
console.log("URL: ", window.location.href)

setTimeout(() => {
    const supportCase = new SalesforceCase();
    console.log("CASE DETAILS: ", supportCase);
}, 20000);