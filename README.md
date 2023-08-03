# DSE Helper 

A Chrome Extension that can help DSEs perform various tasks like creating ESD templates and open Layer0 logs.

## Installation 
**To install in Google Chrome:**

* Clone this repository to a folder on your machine
* Navigate to `chrome://extensions/` in Chrome
* Ensure that "Developer Mode" is toggled in the upper right-hand corner
* Click the "Load Unpacked" button on the left-hand side of the screen
* Select the folder containing the cloned repository

> **Note:** To update the extension in Chrome after making code changes (or pulling the latest changes from the repo), go to the extension settings page, toggle the "On" switch for the extension, and then refresh any open Salesforce Cases or Layer0 Hub tabs.

## Features
### Salesforce

In Salesfoce Cases, a new `ESD` button will be added to the top menu bar. When clicked, a new ESD template will be created in your personal Google Drive under a directory labeled `ESD Templates`. This template will include the ESD menu bar options to forward the template contents to Jira Service Desk. 

### Layer0 Hub

In the [Layer0 Hub](https://hub.admin.prod.a0core.net/orgs), two new buttons will be displayed when viewing customer Org. The `Login` button will prompt you to authenticate into the proper region and autoclose upon completion, and the `View Logs` button will open a new tab displaying OpenSearch logs of the space. **These buttons should be clicked in sequence**.