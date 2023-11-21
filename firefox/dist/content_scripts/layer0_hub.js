"use strict";
class Layer0Hub {
    constructor() {
        this.deleteOpenSearchButton = () => {
            try {
                if (this.openSearchLabel) {
                    this.openSearchLabel.remove();
                }
                if (this.logsButton) {
                    this.logsButton.remove();
                }
                if (this.loginButton) {
                    this.loginButton.remove();
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        this.getCloudRegion = () => {
            try {
                const cloudDeploymentSection = document.querySelectorAll('ul')[4];
                const cloudProviderSpan = cloudDeploymentSection.querySelectorAll('li span')[3];
                const cloudProvider = cloudProviderSpan.innerText.toLowerCase();
                const primaryRegionLabel = cloudDeploymentSection.querySelectorAll('li')[2];
                const primaryRegion = primaryRegionLabel.querySelectorAll('span')[1].innerText;
                const region = primaryRegion.split('(')[0].replace(/\s/g, '');
                ;
                if (cloudProvider && region) {
                    return { provider: cloudProvider, region: region };
                }
                else {
                    throw new Error("Error: No cloud provider or region found.");
                }
            }
            catch (error) {
                console.error(error);
                return undefined;
            }
        };
        this.getSpace = () => {
            try {
                const selectElement = document.querySelectorAll('select')[0];
                const spaceName = selectElement.querySelectorAll('option[aria-selected="true"]')[0].innerHTML;
                const generalInformationSection = document.querySelectorAll('ul')[1];
                const spaceDomain = generalInformationSection.querySelectorAll('li span strong')[0].innerHTML;
                return { name: spaceName, domain: spaceDomain };
            }
            catch (error) {
                console.error(error);
            }
        };
        this.openSearchLogin = () => {
            const cloud = this.getCloudRegion();
            if (cloud && cloud.region && cloud.provider) {
                window.open(`https://logs.admin.pop-${cloud.provider}-${cloud.region}.pop.prod.a0core.net`, '_blank', 'noopener');
            }
            else {
                console.error("Error: No Region");
            }
        };
        this.openSearchLogs = () => {
            const cloud = this.getCloudRegion();
            const space = this.getSpace();
            if (cloud && cloud.provider === 'aws' && cloud.region && space) {
                window.open(`https://logs.admin.pop-aws-${cloud.region}.pop.prod.a0core.net/_dashboards/app/discover#/?_a=(columns:!(log_type,operation,res.status_code,req.ip,space,tenant),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:logs_server,key:space,negate:!f,params:(query:${space}),type:phrase),query:(match_phrase:(space:${space})))),index:logs_server,interval:auto,query:(language:kuery,query:''),sort:!())&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))`, '_blank', 'noopener');
            }
            else if ((cloud === null || cloud === void 0 ? void 0 : cloud.provider) === 'azure' && cloud.region && space) {
                window.open(`https://logs.admin.pop-azure-${cloud.region}.pop.prod.a0core.net/app/discover#/?_a=(columns:!(operation,res.status_code,req.ip,space,tenant),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:logs,key:space,negate:!f,params:(query:${space}),type:phrase),query:(match_phrase:(space:${space})))),index:logs,interval:auto,query:(language:kuery,query:''),sort:!())&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1w,to:now))`, '_blank', 'noopener');
            }
            else {
                console.error("Error: No Provider, Region, or Space");
            }
        };
    }
    createOpenSearchButtons() {
        try {
            // Create label
            this.openSearchLabel = document.createElement('h5');
            this.openSearchLabel.setAttribute('id', 'open-search-lable');
            this.openSearchLabel.setAttribute('class', 'MuiTypography-root general-info MuiTypography-h5');
            this.openSearchLabel.setAttribute('style', 'text-align: right; align-self: center; margin: 0 5px');
            this.openSearchLabel.innerHTML = 'OpenSearch: ';
            // Create login button
            this.loginButton = document.createElement('button');
            this.loginButton.setAttribute('id', 'open-search-login-btn');
            this.loginButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary');
            this.loginButton.setAttribute('style', 'margin: 0 5px');
            this.loginButton.innerHTML = 'Login';
            this.loginButton.addEventListener('click', this.openSearchLogin);
            // Create logs button
            this.logsButton = document.createElement('button');
            this.logsButton.setAttribute('id', 'open-search-logs-btn');
            this.logsButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary');
            this.logsButton.setAttribute('style', 'margin: 0 5px');
            this.logsButton.innerHTML = 'View Logs';
            this.logsButton.addEventListener('click', this.openSearchLogs);
            // Get header menu
            const generalInformationNode = document.querySelectorAll('div.MuiPaper-root.MuiCard-root.MuiPaper-outlined.MuiPaper-rounded > div.container')[0];
            // Insert elements
            generalInformationNode.appendChild(this.openSearchLabel);
            generalInformationNode.appendChild(this.loginButton);
            generalInformationNode.appendChild(this.logsButton);
        }
        catch (error) {
            console.error(error);
        }
    }
}
const layer0Hub = new Layer0Hub;
browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req && req.layer0HubDetailsPage) {
        setTimeout(() => {
            layer0Hub.deleteOpenSearchButton();
            layer0Hub.createOpenSearchButtons();
            res("200 Success");
        }, 2000);
    }
    else {
        layer0Hub.deleteOpenSearchButton();
    }
});
