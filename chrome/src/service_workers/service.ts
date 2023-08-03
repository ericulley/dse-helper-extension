importScripts('sf_services.js');

/*******************
 * 
 * Message Listeners
 * 
 *******************/
chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/services/create-template' && req.fileName) {
        try {
            chrome.identity.getAuthToken({interactive: true}, async (token: string | undefined) => {
                if (token) {
                    let newCopyId;
        
                    // Check if 'ESD Templates' folder already exists
                    let folderId = await checkForFolder(token!) as unknown as string;
        
                    // If no folder was found, create one.
                    if (!folderId) {
                        folderId = await createFolder(token!)as unknown as string;
                    } 
                
                    // Create template in folder
                    if (folderId) {
                        newCopyId = await createFile(token!, folderId, req.fileName) as unknown as string;
                    } else {
                        throw new Error("Error: No Folder ID");
                    }
        
                    res({newCopyId: newCopyId});
                } else {
                    throw new Error("401 Unauthorized: No Token");
                }
            });
            return true;
        } catch (error) {
            console.error(error);
            res({error: error});
            return false;
        }
    } 
});

chrome.runtime.onMessage.addListener(async (req, _sender, res) => {
    if (req.path === '/api/os-login-autoclose' && req.autoclose) {
        let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
        console.log("Tab: ", tab);
        if (tab && tab.id) {
            chrome.tabs.remove(tab.id);
        }
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId && changeInfo.status && changeInfo.status === 'complete' && tab.url) {
        // Listen for Layer0 Hub pages
        if (tab.url.includes('https://hub.admin.prod.a0core.net/orgs/detail/')) {
            try {
                chrome.tabs.sendMessage(tabId, {
                    layer0HubDetailsPage: true
                });
            } catch (error) {
                console.error(error);
            }
        }
    
        // Listen for Salesforce Case pages
        else if (tab.url.includes('https://auth0.lightning.force.com/lightning/')) {
            let body = {}
            const path = tab.url.split('/')
            if (path[4] === 'r' && 
                path[5] === 'Case' && 
                path[7] === 'view') {
                body = {
                    salesforce: true,
                    caseView: true
                };
            } else {
                body = {
                    salesforce: true,
                    caseView: false
                };
            }
            try {
                chrome.tabs.sendMessage(tabId, body);
            } catch (error) {
                console.error(error)
            }
        }
    }
})