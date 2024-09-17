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
    // Add Material Symbols Outlined stylesheet dynamically if not already included
    if (!document.querySelector("link[href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
        document.head.appendChild(link);
    }

    const note = document.createElement("div");
    const noteTopBar = document.createElement("div");
    const noteText = document.createElement("textarea");
    const colorButton = document.createElement("span");
    const colorBox = document.createElement("div");

    // Create note container
    note.style.position = "absolute";
    note.style.top = window.scrollY + "px";
    note.style.left = "10px";
    note.style.width = "200px";
    note.style.backgroundColor = "white"; // Default color
    note.style.border = "1px solid black";
    note.style.borderRadius = "10px"; // Added border radius
    note.style.zIndex = "10000";
    
    // Create top bar (white with black text)
    noteTopBar.style.background = "white";
    noteTopBar.style.padding = "5px";
    noteTopBar.style.cursor = "move";
    noteTopBar.style.display = "flex";
    noteTopBar.style.justifyContent = "space-between";
    noteTopBar.style.borderBottom = "1px solid black"; // To visually separate from the body
    noteTopBar.style.borderTopLeftRadius = "10px"; // Match border radius
    noteTopBar.style.borderTopRightRadius = "10px"; // Match border radius

    // Add date to top bar (left side)
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    const dateText = document.createElement("span");
    dateText.textContent = formattedDate;
    dateText.style.color = "black"; // Black text
    noteTopBar.appendChild(dateText);
    
    // Add color change button (right side)
    colorButton.className = "material-symbols-outlined";
    colorButton.textContent = "palette"; // Material icon for color palette
    colorButton.style.fontFamily = "'Material Symbols Outlined'";
    colorButton.style.color = "black";
    colorButton.style.cursor = "pointer";
    noteTopBar.appendChild(colorButton);
    
    // Create color selection box (hidden by default)
    colorBox.style.display = "none"; // Hidden until the icon is clicked
    colorBox.style.position = "absolute";
    colorBox.style.top = "30px";
    colorBox.style.left = "10px";
    colorBox.style.background = "white";
    colorBox.style.border = "1px solid black";
    colorBox.style.padding = "5px";
    colorBox.style.borderRadius = "10px"; // Match border radius
    colorBox.style.display = "flex";
    colorBox.style.gap = "5px";
    colorBox.style.zIndex = "10001";
    
    // Hex color options
    const hexColors = ["#FFFF00", "#ADD8E6", "#90EE90", "#FFC0CB", "#FFA500"];
    hexColors.forEach(color => {
        const colorOption = document.createElement("div");
        colorOption.style.backgroundColor = color;
        colorOption.style.width = "20px";
        colorOption.style.height = "20px";
        colorOption.style.borderRadius = "50%";
        colorOption.style.cursor = "pointer";
        colorOption.addEventListener("click", () => {
            note.style.backgroundColor = color; // Change the note color
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
    noteText.style.color = "black"; // Text color black
    noteText.style.fontFamily = "'Arial', sans-serif"; // Fixed font family
    noteText.style.fontSize = "14px"; // Fixed text size

    // Apply CSS for placeholder text color
    const style = document.createElement('style');
    style.textContent = `
        textarea::placeholder {
            color: black;
        }

        .note-text {
            scrollbar-width: thin;
        }

        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    `;
    document.head.appendChild(style);
    
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
