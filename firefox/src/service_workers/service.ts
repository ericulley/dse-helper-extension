/*******************
 * Type Declarations
 *******************/
interface Req {
    method: 'GET' | 'POST',
    headers: {
        "Authorization": string,
        "Content-Type": 'application/json'
    }, 
    body?: string
}

/**********************
 * Google Authorization 
 **********************/
const authorize = async () => {
    const redirectURL = browser.identity.getRedirectURL();
    console.log("DSE Helper Extension's Redirect URL: ", redirectURL);
    const clientID = '30946108485-o0ftk7a4u0qvghgv3ve52jbudljj3rsr.apps.googleusercontent.com';
    const scopes = ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/drive"];
    let authURL = "https://accounts.google.com/o/oauth2/auth";
    authURL += `?client_id=${clientID}`;
    authURL += `&response_type=token`;
    authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
    authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

    const response = await browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL,
    });

    const responseParams = response.split('#')[1].split('&')
    let authResponse: {
        [key: string]: string
    } = {};
    responseParams.forEach((param) => {
        const key = param.split('=')[0];
        const val = param.split('=')[1];
        authResponse[key] = val;
    })
    return authResponse.access_token ? authResponse.access_token : undefined;
}

/*******************
 * Google Drive API
 *******************/
const checkForFolder = async (authToken: string): Promise<string | undefined> => {
    const request: Req = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };
    const queryString: string = encodeURIComponent('mimeType="application/vnd.google-apps.folder" and parents="root" and name="ESD Templates" and trashed=false');

    try {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${queryString}`, request);
        const data = await res.json();

        if (data.files && data.files.length > 0 && data.files[0].name === 'ESD Templates') {
            return data.files[0].id;
        } else {
            return undefined;
        }
    } catch (error) {
        console.error(error);
     }
   
}

const createFolder = async (authToken: string): Promise<string | Error> => {
    const request: Req = {
        method: 'POST',
        body: JSON.stringify({
            mimeType: 'application/vnd.google-apps.folder',
            name: 'ESD Templates',
            parents: ['root']
        }),
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await fetch('https://www.googleapis.com/drive/v3/files', request);
        const data = await res.json();

        if (data && data.id) {
            return data.id as string;
        } else {
            throw new Error(`Error: ${data}`);
        }
    } catch (error) {
        console.error(error);
        return error as Error;
     }
   
}

const createFile = async (authToken: string, folder: string, fileName: string): Promise<string | Error> => {
    const request: Req = {
        method: 'POST',
        body: JSON.stringify({
            name: fileName,
            parents: [folder], 
            permissionIds: ['01913879928154247020k']
        }), 
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const res = await fetch('https://www.googleapis.com/drive/v3/files/1QhUE0aoPeMmDTJJGVVkzA3ugHGWHeXmGtE1oKjpaO6I/copy?supportsAllDrives=true', request);
        const data = await res.json();
        if (data.id) {
            return data.id;
        } else {
            throw new Error(data);
        }
    } catch (error) {
       console.error(error);
       return error as Error;
    }
}

/*******************
 * Listeners
 *******************/
browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/api/create-template' && req.fileName) {
        try {
            authorize().then(async (token) => {
                if (token) {
                    let newCopyId: string | Error;
        
                    // Check if 'ESD Templates' folder already exists
                    let folderId = await checkForFolder(token) as unknown as string;
        
                    // If no folder was found, create one.
                    if (!folderId) {
                        folderId = await createFolder(token!)as unknown as string;
                    } 
                
                    // Create template in folder
                    if (folderId) {
                        newCopyId = await createFile(token, folderId, req.fileName) as unknown as string;
                        res({newCopyId: newCopyId});
                    } else {
                        throw new Error("Error: No Folder ID");
                    }
                } else {
                    throw new Error("401 Unauthorized: No Token");
                }
            });
            return true;
        } catch (error) {
            console.error(error);
        }
    } 
});

browser.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/api/os-login-autoclose' && req.autoclose) {
        browser.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
            console.log("Tab: ", tab);
            if (tab && tab.id) {
                browser.tabs.remove(tab.id);
                res("200 OK");
            }
        });
    }
});

/*******************
 * Triggers
 *******************/
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId && changeInfo.status && changeInfo.status === 'complete' && tab.url) {

        // Listen for Salesforce Case pages
        if (tab.url.includes('https://auth0.lightning.force.com/lightning/')) {
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
                browser.tabs.sendMessage(tabId, body);
            } catch (error) {
                console.error(error)
            }
        } 

        // Listen for Layer0 Hub pages
        if (tab.url.includes('https://hub.admin.prod.a0core.net/orgs/detail/')) {
            try {
                browser.tabs.sendMessage(tabId, {
                    layer0HubDetailsPage: true
                });
            } catch (error) {
                console.error(error);
            }
        }
    }
})