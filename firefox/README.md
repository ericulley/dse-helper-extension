> **Notice:** Development of the Firefox version of this extension has been put on hold due to the security resitrctions placed on browsers other than Chrome.

# DSE Helper (Firefox Extension)

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

## Differences in Firefox Extension
* Must enabled permissions in the extenion's settings.
* `importScripts(...)` doesn't seem to work.
* `async...await` doesn't seem to work; use `.then()` instead.

## Problems
* Extension needs to be reloaded each time Firefox is closed. 
* Each time it's reloaded, it generates a new callback URL for Google auth. 
* Doesn't auto close the OpenSearch Login window. There seems to be an issue with the `context_scripts[].matches` field not triggering. Maybe because of the sub domain wildcard.