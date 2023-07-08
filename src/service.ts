interface Req {
    method: 'GET' | 'POST',
    headers: {
        "Authorization": string,
        "Content-Type": string
    }, 
    body?: string
}

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
            console.log("Found Folder: ", data.files[0]);
            return data.files[0].id;
        } else {
            return undefined
        }
    } catch (err: any) {
        if (typeof err === 'object'){
            throw new Error(JSON.stringify(err));
        } else {
            throw new Error(err);
        }
    }
   
}

const createFolder = async (authToken: string): Promise<string> => {
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

        /**** PICKUP WORK HERE ****/
        console.log("Data; New Folder Id: ", data.id);
        return data.id as string
       
    } catch (err: any) {
        if (typeof err === 'object'){
            throw new Error(JSON.stringify(err));
            console.error(err);
        } else {
            throw new Error(err);
        }
    }
   
}

const createFile = async (authToken: string, folder: string, fileName: string): Promise<string> => {
    console.log("Create File: Folder ID: ", folder)
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
        const res = await fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', request)
        const data = await res.json()
        if (data.id) {
            console.log("Data; New Copy's ID: ", data.id);
            return data.id
        } else {
            throw new Error(data)
        }
    } catch (err: any) {
        if (typeof err === 'object'){
            throw new Error(err);
        } else {
            throw new Error(err);
        }
    }
}

chrome.runtime.onMessage.addListener((req, _sender, res) => {
    if (req.path === '/services/create-template' && req.fileName) {
        chrome.identity.getAuthToken({interactive: true}, async (token) => {
            let newCopyId

            // Check if 'ESD Templates' folder already exists
            let folderId = await checkForFolder(token) as unknown as string;

            // If no folder was found, create one.
            if (!folderId) {
                folderId = await createFolder(token)as unknown as string;
            } 
        
            // Create template in folder
            if (folderId) {
                newCopyId = await createFile(token, folderId, req.fileName) as unknown as string;
            } else {
                throw new Error("Error: No Folder ID");
            }

            res({newCopyId: newCopyId});
        });
        return true;
    } 
});