// htmlScript.js
(() => {
    const html = document.documentElement.outerHTML; // Get all HTML
    chrome.runtime.sendMessage({ action: "getSource", source: html }); // Send HTML to the background script
  })();