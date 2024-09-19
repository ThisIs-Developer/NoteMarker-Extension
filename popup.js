document.getElementById("highlight").addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: showColorBoxAboveSelection
        });
    });
});

document.getElementById("clear").addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: clearAnnotations
        });
    });
});

document.getElementById("sticky-note").addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: createStickyNote
        });
    });
});


function showColorBoxAboveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

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
                browser.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: highlightSelectedText,
                    args: [color]
                });
                document.body.removeChild(colorBox);
            });
            colorBox.appendChild(colorButton);
        });

        document.body.appendChild(colorBox);
    }
}

function clearAnnotations() {
    const highlights = document.querySelectorAll("span[style*='background-color:']");
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        while (highlight.firstChild) {
            parent.insertBefore(highlight.firstChild, highlight);
        }
        parent.removeChild(highlight);
    });
}

function createStickyNote() {
    if (!document.querySelector("link[href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,250,0,0']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,250,0,0";
        document.head.appendChild(link);
    }

    const note = document.createElement("div");
    const noteTopBar = document.createElement("div");
    const noteText = document.createElement("textarea");
    const colorButton = document.createElement("span");
    const copyButton = document.createElement("span");
    const cancelButton = document.createElement("span");
    const colorBox = document.createElement("div");

    note.style.position = "absolute";
    note.style.top = window.scrollY + "px";
    note.style.left = "10px";
    note.style.width = "200px";
    note.style.backgroundColor = "white";
    note.style.border = "1px solid black";
    note.style.borderRadius = "10px";
    note.style.zIndex = "10000";
    note.style.transition = "opacity 300ms ease";

    noteTopBar.style.background = "white";
    noteTopBar.style.padding = "5px";
    noteTopBar.style.cursor = "move";
    noteTopBar.style.display = "flex";
    noteTopBar.style.justifyContent = "space-between";
    noteTopBar.style.alignItems = "center";
    noteTopBar.style.borderBottom = "1px solid black";
    noteTopBar.style.borderTopLeftRadius = "10px";
    noteTopBar.style.borderTopRightRadius = "10px";

    const date = new Date();
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

    const timeText = document.createElement("span");
    timeText.textContent = formattedTime;
    timeText.style.color = "black";
    timeText.style.cursor = "pointer";
    timeText.style.transition = "opacity 300ms ease";
    timeText.style.opacity = "1";

    timeText.addEventListener("mouseover", () => {
        timeText.style.opacity = "0";
        setTimeout(() => {
            timeText.textContent = formattedDate;
            timeText.style.opacity = "1";
        }, 300);
    });

    timeText.addEventListener("mouseout", () => {
        timeText.style.opacity = "0";
        setTimeout(() => {
            timeText.textContent = formattedTime;
            timeText.style.opacity = "1";
        }, 300);
    });

    noteTopBar.appendChild(timeText);

    const iconContainer = document.createElement("div");
    iconContainer.style.display = "flex";
    iconContainer.style.gap = "5px";

    copyButton.className = "material-symbols-outlined";
    copyButton.textContent = "content_copy";
    copyButton.style.fontFamily = "'Material Symbols Outlined'";
    copyButton.style.color = "black";
    copyButton.style.cursor = "pointer";
    copyButton.style.fontWeight = "300";
    copyButton.addEventListener("click", () => {
        noteText.select();
        document.execCommand("copy");
        copyButton.textContent = "done";
        setTimeout(() => {
            copyButton.textContent = "content_copy"; 
        }, 1000);
    });
    iconContainer.appendChild(copyButton);

    colorButton.className = "material-symbols-outlined";
    colorButton.textContent = "palette";
    colorButton.style.fontFamily = "'Material Symbols Outlined'";
    colorButton.style.color = "black";
    colorButton.style.cursor = "pointer";
    colorButton.style.fontWeight = "300";
    iconContainer.appendChild(colorButton);

    cancelButton.className = "material-symbols-outlined";
    cancelButton.textContent = "close";
    cancelButton.style.fontFamily = "'Material Symbols Outlined'";
    cancelButton.style.color = "black";
    cancelButton.style.cursor = "pointer";
    cancelButton.addEventListener("click", () => {
        note.style.opacity = "0";
        setTimeout(() => {
            note.remove(); 
        }, 300);
    });
    iconContainer.appendChild(cancelButton);

    noteTopBar.appendChild(iconContainer);

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

    colorButton.addEventListener("click", () => {
        colorBox.style.display = colorBox.style.display === "none" ? "flex" : "none";
    });

    noteText.placeholder = "Enter note here...";
    noteText.style.width = "100%";
    noteText.style.height = "100px";
    noteText.style.border = "none";
    noteText.style.padding = "5px";
    noteText.style.backgroundColor = "transparent";
    noteText.style.color = "black";
    noteText.style.fontFamily = "'Arial', sans-serif";
    noteText.style.fontSize = "14px";

    const style = document.createElement('style');
    style.textContent = `
        textarea::placeholder {
            color: black;
        }

        ::-webkit-scrollbar {
            width: 5px;
        }

        textarea {
            scrollbar-width: thin;
        }

        textarea::-webkit-scrollbar-thumb {
            border-radius: 50%;
        }
    `;
    document.head.appendChild(style);

    note.appendChild(noteTopBar);
    note.appendChild(noteText);
    note.appendChild(colorBox);
    document.body.appendChild(note);

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
