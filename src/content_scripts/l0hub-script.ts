class Layer0Hub {

    constructor() {
        this.createOpenSearchLoginButton();       
    }

    private createOpenSearchLoginButton() {
        try {
            // Create login button
            const loginButton = document.createElement('button') as HTMLButtonElement;
            loginButton.setAttribute('id', 'open-search-login-btn');
            loginButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizelarge');
            loginButton.innerHTML = 'Login'
            loginButton.addEventListener('click', this.openSearchLogin);
            // Create logs button
            const logsButton = document.createElement('button') as HTMLButtonElement;
            logsButton.setAttribute('id', 'open-search-logs-btn');
            logsButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-containedSizeLarge MuiButton-sizelarge');
            logsButton.innerHTML = 'View Logs'
            logsButton.addEventListener('click', ()=>{console.log("LOGS")});
            
            // Get header menu
            const generalInformationNode = document.querySelectorAll('div.MuiPaper-root.MuiCard-root.MuiPaper-outlined.MuiPaper-rounded > div.container')[0];

            console.log("Container: ", generalInformationNode);
            
            // Insert button
            generalInformationNode.appendChild(loginButton);
            generalInformationNode.appendChild(logsButton);

        } catch (err: any) {
            throw new Error(err);
        }   
    }

    private openSearchLogin = () => {
        const cloudDeploymentSection = document.querySelectorAll('ul')[4];
        const primaryRegionLabel = cloudDeploymentSection.querySelectorAll('li')[2];
        const primaryRegion = primaryRegionLabel.querySelectorAll('span')[1].innerText;
        console.log("Primary Region: ", primaryRegion);
        const awsRegion = primaryRegion.split(' ')[0]

        window.open(`https://logs.admin.pop-aws-${awsRegion}.pop.prod.a0core.net`, '_blank');
    }
}

setTimeout(() => {
    new Layer0Hub();
}, 2000);