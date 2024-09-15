function highlightText() {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.textContent = selection.toString();
  
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
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
    const highlights = document.querySelectorAll("span[style='background-color: yellow;']");
    highlights.forEach(highlight => highlight.remove());
  
    const notes = document.querySelectorAll("div[contentEditable='true']");
    notes.forEach(note => note.remove());
  }
  