document.getElementById("highlight").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: showColorBoxAboveSelection
      });
  });
});

document.getElementById("sticky-note").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: addStickyNote
      });
  });
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: clearAnnotations
      });
  });
});

function showColorBoxAboveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Create color selector box
      const colorBox = document.createElement("div");
      colorBox.id = 'highlight-toolbar';
      colorBox.style.position = "absolute";
      colorBox.style.top = `${window.scrollY + rect.top - 40}px`;
      colorBox.style.left = `${window.scrollX + rect.left}px`;
      colorBox.style.display = "flex";
      colorBox.style.border = "1px solid #ccc";
      colorBox.style.borderRadius = "10px";
      colorBox.style.backgroundColor = "white";
      colorBox.style.padding = "5px";
      colorBox.style.zIndex = "10000";
      
      // Color options
      const colors = ["yellow", "lightblue", "lightgreen", "pink", "orange"];
      colors.forEach(color => {
          const colorButton = document.createElement("div");
          colorButton.style.backgroundColor = color;
          colorButton.style.width = "20px";
          colorButton.style.height = "20px";
          colorButton.style.borderRadius = "50%";
          colorButton.style.margin = "2px";
          colorButton.style.cursor = "pointer";
          colorButton.addEventListener("click", () => {
              chrome.scripting.executeScript({
                  target: { tabId: chrome.tabs.TAB_ID }, // Placeholder, will be dynamically replaced
                  function: highlightSelectedText,
                  args: [color]
              });
              document.body.removeChild(colorBox);
          });
          colorBox.appendChild(colorButton);
      });

      document.body.appendChild(colorBox);
  }

  function highlightSelectedText(color) {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
          const span = document.createElement("span");
          span.style.backgroundColor = color;
          span.textContent = selection.toString();
          
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(span);
      }
  }
}

function addStickyNote() {
  const note = document.createElement("div");
  note.contentEditable = true;
  note.innerText = "Enter note here...";
  note.style.position = "absolute";
  note.style.top = window.scrollY + "px";
  note.style.left = "10px";
  note.style.background = "lightyellow";
  note.style.padding = "10px";
  note.style.border = "1px solid black";
  document.body.appendChild(note);
}

function clearAnnotations() {
  const highlights = document.querySelectorAll("span[style*='background-color:']");
  highlights.forEach(highlight => highlight.remove());

  const notes = document.querySelectorAll("div[contentEditable='true']");
  notes.forEach(note => note.remove());
}
