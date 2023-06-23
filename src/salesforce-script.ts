class SalesforceCaseDetails {

    caseTenant: string | null;
    casePriority: string | null;

    constructor() {
        // Get tenant name
        this.caseTenant = document.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[5].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;

        // Get priority
        this.casePriority = document.getElementsByClassName('slds-form')[0].childNodes[0].childNodes[7].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[0].textContent;
    }
}

setTimeout(() => {
    const caseDetails = new SalesforceCaseDetails();
    console.log("CASE DETAILS: ", caseDetails);
}, 15000);
