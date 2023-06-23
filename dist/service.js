"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: 'popup.html' });
});
//# sourceMappingURL=service.js.map