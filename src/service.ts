import { checkForFolder, createFolder, createFile} from './service_functions/google_api';

chrome.runtime.onMessage.addListener((req, _sender, res) => {
    try {
        if (req.path === '/services/create-template' && req.fileName) {
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
        } else {
            throw new Error("400 Bad Request");
        }
    } catch (error) {
        console.error(error);
        res({error: error});
        return false;
    }
});