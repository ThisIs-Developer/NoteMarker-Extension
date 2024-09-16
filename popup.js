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

function clearAnnotations() {
  const highlights = document.querySelectorAll("span[style*='background-color:']");
  highlights.forEach(highlight => highlight.remove());

  const notes = document.querySelectorAll("div[contentEditable='true']");
  notes.forEach(note => note.remove());
}
document.getElementById("sticky-note").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: createStickyNote
      });
  });
});

function createStickyNote() {
  const note = document.createElement("div");
  const noteTopBar = document.createElement("div");
  const noteText = document.createElement("textarea");
  const colorButton = document.createElement("button");
  const colorBox = document.createElement("div");
  
  // Create note container
  note.style.position = "absolute";
  note.style.top = window.scrollY + "px";
  note.style.left = "10px";
  note.style.width = "200px";
  note.style.backgroundColor = "white";
  note.style.border = "1px solid black";
  note.style.borderRadius = "5px";
  note.style.zIndex = "10000";
  
  // Create top bar
  noteTopBar.style.background = "#e0e0e0";
  noteTopBar.style.padding = "5px";
  noteTopBar.style.cursor = "move";
  noteTopBar.style.display = "flex";
  noteTopBar.style.justifyContent = "space-between";
  
  // Add date to top bar (left side)
  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  const dateText = document.createElement("span");
  dateText.textContent = formattedDate;
  noteTopBar.appendChild(dateText);
  
  // Add color change button (right side)
  colorButton.textContent = "🎨";
  colorButton.style.border = "none";
  colorButton.style.background = "transparent";
  colorButton.style.cursor = "pointer";
  noteTopBar.appendChild(colorButton);
  
  // Create color selection box (hidden by default)
  colorBox.style.display = "none";
  colorBox.style.position = "absolute";
  colorBox.style.top = "30px";
  colorBox.style.left = "10px";
  colorBox.style.background = "white";
  colorBox.style.border = "1px solid black";
  colorBox.style.padding = "5px";
  colorBox.style.borderRadius = "5px";
  colorBox.style.display = "flex";
  colorBox.style.gap = "5px";
  
  // Color options
  const colors = ["yellow", "lightblue", "lightgreen", "pink", "orange"];
  colors.forEach(color => {
      const colorOption = document.createElement("div");
      colorOption.style.backgroundColor = color;
      colorOption.style.width = "20px";
      colorOption.style.height = "20px";
      colorOption.style.borderRadius = "50%";
      colorOption.style.cursor = "pointer";
      colorOption.addEventListener("click", () => {
          note.style.backgroundColor = color;
          colorBox.style.display = "none"; // Hide after selection
      });
      colorBox.appendChild(colorOption);
  });
  
  // Show/hide color selection box on click
  colorButton.addEventListener("click", () => {
      colorBox.style.display = colorBox.style.display === "none" ? "flex" : "none";
  });
  
  // Create note text area
  noteText.placeholder = "Enter note here...";
  noteText.style.width = "100%";
  noteText.style.height = "100px";
  noteText.style.border = "none";
  noteText.style.padding = "5px";
  noteText.style.backgroundColor = "transparent";
  noteText.style.color = "black";
  noteText.style.resize = "none"; // Disable resizing
  
  // Append elements to note
  note.appendChild(noteTopBar);
  note.appendChild(noteText);
  note.appendChild(colorBox);
  document.body.appendChild(note);
  
  // Make the note draggable
  noteTopBar.onmousedown = function (event) {
      let shiftX = event.clientX - note.getBoundingClientRect().left;
      let shiftY = event.clientY - note.getBoundingClientRect().top;

      function moveAt(pageX, pageY) {
          note.style.left = pageX - shiftX + 'px';
          note.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      noteTopBar.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove);
          noteTopBar.onmouseup = null;
      };
  };

  noteTopBar.ondragstart = function () {
      return false;
  };
}
