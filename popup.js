document.getElementById("highlight").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          const selection = window.getSelection();
          if (selection.toString().length > 0) {
            const span = document.createElement("span");
            span.style.backgroundColor = "lightblue";
            span.textContent = selection.toString();
  
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(span);
          }
        }
      });
    });
  });
  
  document.getElementById("sticky-note").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          const note = document.createElement("textarea");
          note.placeholder = "Enter note here...";
          note.style.position = "absolute";
          note.style.top = window.scrollY + "px";
          note.style.left = "10px";
          note.style.background = "lightyellow";
          note.style.padding = "10px";
          note.style.border = "1px solid black";
          note.style.color = "black";
          note.style.width = "200px";
          note.style.height = "100px";
          
          const style = document.createElement('style');
          style.textContent = `
            textarea::placeholder {
              color: darkgray;
            }
          `;
          document.head.appendChild(style);
          
          document.body.appendChild(note);
        }
      });
    });
  });
  
  document.getElementById("clear").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: () => {
          const annotations = document.querySelectorAll("span[style*='background-color: lightblue']");
          annotations.forEach((annotation) => {
            const parent = annotation.parentNode;
            parent.replaceChild(document.createTextNode(annotation.textContent), annotation);
          });
  
          const stickyNotes = document.querySelectorAll("div[contenteditable='true']");
          stickyNotes.forEach((note) => {
            note.remove();
          });
        }
      });
    });
  });
  