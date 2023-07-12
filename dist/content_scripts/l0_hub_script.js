"use strict";
class Layer0Hub {
    constructor() {
        this.openSearchLogin = () => {
            const cloudDeploymentSection = document.querySelectorAll('ul')[4];
            const primaryRegionLabel = cloudDeploymentSection.querySelectorAll('li')[2];
            const primaryRegion = primaryRegionLabel.querySelectorAll('span')[1].innerText;
            console.log("Primary Region: ", primaryRegion);
            const awsRegion = primaryRegion.split(' ')[0];
            window.open(`https://logs.admin.pop-aws-${awsRegion}.pop.prod.a0core.net`, '_blank');
        };
        this.createOpenSearchButtons();
    }
    createOpenSearchButtons() {
        try {
            // Create label
            const openSearchLabel = document.createElement('h5');
            openSearchLabel.setAttribute('id', 'open-search-lable');
            openSearchLabel.setAttribute('class', 'MuiTypography-root general-info MuiTypography-h5');
            openSearchLabel.setAttribute('style', 'text-align: right; align-self: center; margin: 0 5px');
            openSearchLabel.innerHTML = 'OpenSearch: ';
            // Create login button
            const loginButton = document.createElement('button');
            loginButton.setAttribute('id', 'open-search-login-btn');
            loginButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary');
            loginButton.setAttribute('style', 'margin: 0 5px');
            loginButton.innerHTML = 'Login';
            loginButton.addEventListener('click', this.openSearchLogin);
            // Create logs button
            const logsButton = document.createElement('button');
            logsButton.setAttribute('id', 'open-search-logs-btn');
            logsButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary');
            logsButton.setAttribute('style', 'margin: 0 5px');
            logsButton.innerHTML = 'View Logs';
            logsButton.addEventListener('click', () => { console.log("LOGS"); });
            // Get header menu
            const generalInformationNode = document.querySelectorAll('div.MuiPaper-root.MuiCard-root.MuiPaper-outlined.MuiPaper-rounded > div.container')[0];
            // Insert elements
            generalInformationNode.appendChild(openSearchLabel);
            generalInformationNode.appendChild(loginButton);
            generalInformationNode.appendChild(logsButton);
        }
        catch (err) {
            throw new Error(err);
        }
    }
}
setTimeout(() => {
    new Layer0Hub();
}, 2000);
//# sourceMappingURL=l0_hub_script.js.map