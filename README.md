# DSE Helper 

A Chrome Extension that can help DSEs perform various tasks like creating ESD templates and open Layer0 logs.

## Installation 
**To install in Chrome:**

* Clone this repository to a folder on your machine
* Navigate to `chrome://extensions/` in Chrome
* Ensure that "Developer Mode" is toggled in the upper right-hand corner
* Click the "Load Unpacked" button on the left-hand side of the screen
* Select the `chrome` folder from the cloned repository

> **Note:** To update the extension in Chrome, `cd` into the parent directory and pull down the latest version with `git pull origin main`. Then go to the extension settings page in Chrome, toggle the "On" switch for the extension, and then refresh any open Salesforce Cases or Layer0 Hub tabs.

## Features
### Salesforce

* In Salesfoce Cases, a new `ESD` button will be added to the top menu bar. When clicked, a new ESD template will be created in your personal Google Drive under a directory labeled `ESD Templates`. This template will include the [ESD menu and commands](https://oktawiki.atlassian.net/wiki/spaces/DS/pages/2605716589/Engineering+Escalation+Template+For+Creating+ESDs) to forward the template data to Jira Service Desk. <img src="/images/Screenshot%202023-08-18%20at%2012.32.15%20AM.png/?raw=true" alt="ESD Button" width="800"/>

* When the extenions detects a Private Cloud customer (a Root Domain Authority value exists), a link to the Layer0 Hub will be created and the domain of the layer0 space will be copied to your clipboard when the link is followed. 
<img src="/images/Screenshot%202023-08-18%20at%2012.35.12%20AM.png/?raw=true" alt="Layer0 Hub Link" width="400"/>

### Layer0 Hub

* In the [Layer0 Hub](https://hub.admin.prod.a0core.net/orgs), two new buttons will be displayed when viewing customer Orgs. The `Login` button will prompt you to authenticate into the proper region and autoclose the login tab upon completion (this autoclose feature is blocked in Firefox), and the `View Logs` button will open a new tab displaying OpenSearch logs of the space. **These buttons should be clicked in sequence**. <img src="/images/Screenshot%202023-08-18%20at%2012.37.00%20AM.png/?raw=true" alt="OpenSearch Buttons" width="800"/>

## Contributing

If you would like to contribute, you must be a member of the `Developer Support Engineer` team in GitHub. To be added, you'll need to request access via a Lighthouse ticket. 
