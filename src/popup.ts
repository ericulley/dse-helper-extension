window.onload = () => {

    document.getElementById('click-me').addEventListener('click', () => {
        console.log("CLICK ME!")
        chrome.identity.getAuthToken({interactive: true}, async (token) => {
            console.log(token);
            fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({parents: ['root']}) 
            }).then((res) => {
                console.log("res: ", res)
                res.json()
            }).then((data) => {
                console.log("data: ", data);
            }).catch((err) => {
                console.log('Error: ', err);
            });
      });
    });

};

console.log("check check");