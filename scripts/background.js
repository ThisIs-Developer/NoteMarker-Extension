browser.runtime.onInstalled.addListener(() => {
  console.log("Webpage Annotator installed.");
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveAnnotations") {
      browser.storage.local.set({ annotations: message.data }).then(() => {
          console.log("Annotations saved.");
          sendResponse({ status: "success" });
      });
      return true;
  }

  if (message.action === "getAnnotations") {
      browser.storage.local.get(["annotations"]).then(result => {
          sendResponse({ annotations: result.annotations || [] });
      });
      return true;
  }
});
