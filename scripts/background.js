chrome.runtime.onInstalled.addListener(() => {
  console.log("Webpage Annotator installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveAnnotations") {
      chrome.storage.local.set({ annotations: message.data }, () => {
          console.log("Annotations saved.");
          sendResponse({ status: "success" });
      });
      return true;
  }

  if (message.action === "getAnnotations") {
      chrome.storage.local.get(["annotations"], (result) => {
          sendResponse({ annotations: result.annotations || [] });
      });
      return true;
  }
});
