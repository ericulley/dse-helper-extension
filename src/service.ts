/*******************
 * 
 * Type Declarations
 * 
 *******************/
interface Req {
    method: 'GET' | 'POST',
    headers: {
        "Authorization": string,
        "Content-Type": 'application/json'
    }, 
    body?: string
}

/*******************
 * 
 * Helper Functions
 * 
 *******************/
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
    } catch (err) {
        console.error(err);
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
    } catch (err) {
        console.error(err);
        return err as Error;
     }
   
}

const createFile = async (authToken: string, folder: string, fileName: string): Promise<string | Error> => {
    const request: Req = {
        method: 'POST',
        body: JSON.stringify({
            name: fileName,
            parents: [folder]
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
    } catch (err) {
       console.error(err);
       return err as Error;
    }
}

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