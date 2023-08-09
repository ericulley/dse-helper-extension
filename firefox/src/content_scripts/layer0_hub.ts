class Layer0Hub {

    constructor() {
        this.createOpenSearchButtons();       
    }

    private createOpenSearchButtons() {
        try {
            // Create label
            const openSearchLabel = document.createElement('h5') as HTMLHeadingElement;
            openSearchLabel.setAttribute('id', 'open-search-lable');
            openSearchLabel.setAttribute('class', 'MuiTypography-root general-info MuiTypography-h5');
            openSearchLabel.setAttribute('style', 'text-align: right; align-self: center; margin: 0 5px');
            openSearchLabel.innerHTML = 'OpenSearch: ';
            
            // Create login button
            const loginButton = document.createElement('button') as HTMLButtonElement;
            loginButton.setAttribute('id', 'open-search-login-btn');
            loginButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary');
            loginButton.setAttribute('style', 'margin: 0 5px');
            loginButton.innerHTML = 'Login';
            loginButton.addEventListener('click', this.openSearchLogin);

            // Create logs button
            const logsButton = document.createElement('button') as HTMLButtonElement;
            logsButton.setAttribute('id', 'open-search-logs-btn');
            logsButton.setAttribute('class', 'MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary');
            logsButton.setAttribute('style', 'margin: 0 5px');
            logsButton.innerHTML = 'View Logs';
            logsButton.addEventListener('click', this.openSearchLogs);
            
            // Get header menu
            const generalInformationNode = document.querySelectorAll('div.MuiPaper-root.MuiCard-root.MuiPaper-outlined.MuiPaper-rounded > div.container')[0];
            
            // Insert elements
            generalInformationNode.appendChild(openSearchLabel);
            generalInformationNode.appendChild(loginButton);
            generalInformationNode.appendChild(logsButton);

        } catch (error) {
            console.error(error);
        }   
    }

    private getAwsRegion = () => {
        try {
            const cloudDeploymentSection = document.querySelectorAll('ul')[4];
            const primaryRegionLabel = cloudDeploymentSection.querySelectorAll('li')[2];
            const primaryRegion = primaryRegionLabel.querySelectorAll('span')[1].innerText;
            const awsRegion = primaryRegion.split(' ')[0];
            return awsRegion;
        } catch (error) {
            console.error(error);
        }
    }

    private getSpace = () => {
        try {
            const selectElement = document.querySelectorAll('select')[0];
            const space = selectElement.querySelectorAll('option[aria-selected="true"]')[0].innerHTML;
            return space;
        } catch (error) {
            console.error(error);
        }
    }

    private openSearchLogin = () => {
        const region = this.getAwsRegion();
        if (region) {
            window.open(`https://logs.admin.pop-aws-${region}.pop.prod.a0core.net`, '_blank', 'noopener');
        } else {
            console.error("Error: No Region");
        }
    }

    private openSearchLogs = () => {
        const region = this.getAwsRegion();
        const space = this.getSpace();
        if (region && space) {
            window.open(`https://logs.admin.pop-aws-${region}.pop.prod.a0core.net/_dashboards/app/discover#/?_a=(columns:!(log_type,operation,res.status_code,req.ip,space,tenant),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:logs_server,key:space,negate:!f,params:(query:${space}),type:phrase),query:(match_phrase:(space:${space})))),index:logs_server,interval:auto,query:(language:kuery,query:''),sort:!())&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-7d,to:now))`, '_blank', 'noopener');
        } else {
            console.error("Error: No Region or Space");
        }
    }
}

browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req && req.layer0HubDetailsPage) {
        setTimeout(() => {
            new Layer0Hub();
            res("200 Success");
        }, 2000);
    }
})