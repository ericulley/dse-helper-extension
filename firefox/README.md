> **Notice:** Development of the Firefox version of this extension has been put on hold due to the security resitrctions placed on browsers other than Chrome.

## Differences in Firefox Extension
* Must enabled permissions in the extenion's settings.
* `importScripts(...)` doesn't seem to work.
* `async...await` doesn't seem to work; use `.then()` instead.

## Problems
* Extension needs to be reloaded each time Firefox is closed. 
* Each time it's reloaded, it generates a new callback URL for Google auth. 
* Doesn't auto close the OpenSearch Login window. There seems to be an issue with the `context_scripts[].matches` field not triggering. Maybe because of the sub domain wildcard.