var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.onload = () => {
    document.getElementById('click-me').addEventListener('click', () => {
        console.log("CLICK ME!");
        chrome.identity.getAuthToken({ interactive: true }, (token) => __awaiter(this, void 0, void 0, function* () {
            console.log(token);
            fetch('https://www.googleapis.com/drive/v3/files/1XW2aCKZgn8Ly8CLY9FeNhmX9LfdJuVlRwPU6LsfuecI/copy?supportsAllDrives=true', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ parents: ['root'] })
            }).then((res) => {
                console.log("res: ", res);
                res.json();
            }).then((data) => {
                console.log("data: ", data);
            }).catch((err) => {
                console.log('Error: ', err);
            });
        }));
    });
};
console.log("check check");
//# sourceMappingURL=popup.js.map