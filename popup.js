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
    if (!document.querySelector("link[href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,250,0,0']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,250,0,0";
        document.head.appendChild(link);
    }

    // Create the note container and elements
    const note = document.createElement("div");
    const noteTopBar = document.createElement("div");
    const noteText = document.createElement("textarea");
    const colorButton = document.createElement("span");
    const copyButton = document.createElement("span");
    const cancelButton = document.createElement("span");
    const colorBox = document.createElement("div");

    // Note container styles
    note.style.position = "absolute";
    note.style.top = window.scrollY + "px";
    note.style.left = "10px";
    note.style.width = "200px";
    note.style.backgroundColor = "white";
    note.style.border = "1px solid black";
    note.style.borderRadius = "10px";
    note.style.zIndex = "10000";
    note.style.transition = "opacity 300ms ease"; // Smooth transition for opacity

    // Top bar styles
    noteTopBar.style.background = "white";
    noteTopBar.style.padding = "5px";
    noteTopBar.style.cursor = "move";
    noteTopBar.style.display = "flex";
    noteTopBar.style.justifyContent = "space-between";
    noteTopBar.style.alignItems = "center";
    noteTopBar.style.borderBottom = "1px solid black";
    noteTopBar.style.borderTopLeftRadius = "10px";
    noteTopBar.style.borderTopRightRadius = "10px";

    // Time formatting
    const date = new Date();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    // Date formatting
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

    const timeText = document.createElement("span");
    timeText.textContent = formattedTime;
    timeText.style.color = "black";
    timeText.style.cursor = "pointer";
    timeText.style.transition = "opacity 300ms ease"; // Add transition effect
    timeText.style.opacity = "1"; // Ensure opacity starts at 1

    // Show date on hover
    timeText.addEventListener("mouseover", () => {
        timeText.style.opacity = "0"; // Fade out effect
        setTimeout(() => {
            timeText.textContent = formattedDate;
            timeText.style.opacity = "1"; // Fade in effect
        }, 300); // Duration of the fade out
    });

    // Show time on mouse out
    timeText.addEventListener("mouseout", () => {
        timeText.style.opacity = "0"; // Fade out effect
        setTimeout(() => {
            timeText.textContent = formattedTime;
            timeText.style.opacity = "1"; // Fade in effect
        }, 300); // Duration of the fade out
    });

    noteTopBar.appendChild(timeText);

    // Container for icons to ensure 5px gap
    const iconContainer = document.createElement("div");
    iconContainer.style.display = "flex"; // Flexbox to hold icons
    iconContainer.style.gap = "5px"; // Add 5px gap between icons

    // Add copy button
    copyButton.className = "material-symbols-outlined";
    copyButton.textContent = "content_copy";
    copyButton.style.fontFamily = "'Material Symbols Outlined'";
    copyButton.style.color = "black";
    copyButton.style.cursor = "pointer";
    copyButton.style.fontWeight = "300";
    copyButton.addEventListener("click", () => {
        noteText.select();
        document.execCommand("copy");
        copyButton.textContent = "done"; // Change icon after copying
        setTimeout(() => {
            copyButton.textContent = "content_copy"; // Reset icon after 1 second
        }, 1000);
    });
    iconContainer.appendChild(copyButton);

    // Add color change button
    colorButton.className = "material-symbols-outlined";
    colorButton.textContent = "palette";
    colorButton.style.fontFamily = "'Material Symbols Outlined'";
    colorButton.style.color = "black";
    colorButton.style.cursor = "pointer";
    colorButton.style.fontWeight = "300";
    iconContainer.appendChild(colorButton);

    // Add cancel button
    cancelButton.className = "material-symbols-outlined";
    cancelButton.textContent = "close";
    cancelButton.style.fontFamily = "'Material Symbols Outlined'";
    cancelButton.style.color = "black";
    cancelButton.style.cursor = "pointer";
    cancelButton.addEventListener("click", () => {
        note.style.opacity = "0"; // Start fade-out animation
        setTimeout(() => {
            note.remove(); // Remove note after animation
        }, 300); // Duration of the fade-out animation
    });
    iconContainer.appendChild(cancelButton);

    // Add icon container to the top bar
    noteTopBar.appendChild(iconContainer);

    // Create color selection box (hidden by default)
    colorBox.style.display = "none";
    colorBox.style.position = "absolute";
    colorBox.style.top = "30px";
    colorBox.style.left = "10px";
    colorBox.style.background = "white";
    colorBox.style.border = "1px solid black";
    colorBox.style.padding = "5px";
    colorBox.style.borderRadius = "10px";
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
            note.style.backgroundColor = color;
            colorBox.style.display = "none";
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
    noteText.style.fontFamily = "'Arial', sans-serif";
    noteText.style.fontSize = "14px";

    // Apply CSS for placeholder text color
    const style = document.createElement('style');
    style.textContent = `
        textarea::placeholder {
            color: black;
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

// Add the CSS for paper-cutting animation
const style = document.createElement('style');
style.textContent = `
    @keyframes paperCut {
         0% { transform: scaleX(1); opacity: 1; }
         100% { transform: scaleX(0); opacity: 0; }
    }

    .note-cut {
        animation: paperCut 300ms ease forwards;
    }
`;
document.head.appendChild(style);


