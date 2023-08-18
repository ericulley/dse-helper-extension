# DSE Helper 

A Chrome Extension that can help DSEs perform various tasks like creating ESD templates and open Layer0 logs.

## Installation 
**To install in Chrome:**

* Clone this repository to a folder on your machine
* Navigate to `chrome://extensions/` in Chrome
* Ensure that "Developer Mode" is toggled in the upper right-hand corner
* Click the "Load Unpacked" button on the left-hand side of the screen
* Select the folder containing the cloned repository

> **Note:** To update the extension in Chrome, `cd` into the parent directory and pull down the latest version with the following command:
>```
> git pull origin main
> ```
> Then go to the extension settings page in Chrome, toggle the "On" switch for the extension, and then refresh any open Salesforce Cases or Layer0 Hub tabs.

**To install in Firefox:**
* Clone this repository to a folder on your machine
* Navigate to `about:debugging#/runtime/this-firefox` in Firefox
* Click the "Load Temporary Add-on..." button on the right-hand side of the screen
* Navigate the folder containing the cloned repository and select the manifest.json file
* **Add Permissions** 
* Navigate to `about:addons` in Firefox to view the installed extension
* View the **Permissions** tab of the extension and enabled all toggles under "Optional permissions for added functionality"
* Lastly, during the first authentication with Google, a redirect_uri error will be thrown. Copy the redirect_uri from the details of the error message and send a copy to `@Eric Culley` to have it included in the allowed redirects. 

> **Note:** To update the extension in Firefox after making code changes (or pulling the latest changes from the repo), go to the extension settings page, toggle the "On" switch for the extension, and then refresh any open Salesforce Cases or Layer0 Hub tabs.

## Features
### Salesforce

* In Salesfoce Cases, a new `ESD` button will be added to the top menu bar. When clicked, a new ESD template will be created in your personal Google Drive under a directory labeled `ESD Templates`. This template will include the [ESD menu and commands](https://oktawiki.atlassian.net/wiki/spaces/DS/pages/2605716589/Engineering+Escalation+Template+For+Creating+ESDs) to forward the template data to Jira Service Desk. 

![](/images/Screenshot%202023-08-18%20at%2012.32.15%20AM.png/?raw=true "ESD Button")

* When the extenions detects a Private Cloud customer (a Root Domain Authority value exists), a link to the Layer0 Hub will be created and the domain of the layer0 space will be copied to your clipboard when the link is followed. 

![](/images/Screenshot%202023-08-18%20at%2012.35.12%20AM.png/?raw=true "Layer0 Hub Link")

<img src="/images/Screenshot%202023-08-18%20at%2012.35.12%20AM.png/?raw=true" alt="Layer0 Hub Link" width="200"/>

### Layer0 Hub

* In the [Layer0 Hub](https://hub.admin.prod.a0core.net/orgs), two new buttons will be displayed when viewing customer Orgs. The `Login` button will prompt you to authenticate into the proper region and autoclose the login tab upon completion (this autoclose feature is blocked in Firefox), and the `View Logs` button will open a new tab displaying OpenSearch logs of the space. **These buttons should be clicked in sequence**.

![](/images/Screenshot%202023-08-18%20at%2012.37.00%20AM.png/?raw=true "OpenSearch Buttons")

## Contributing
