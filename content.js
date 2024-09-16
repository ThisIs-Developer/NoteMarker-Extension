function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.id = 'highlight-toolbar';
  toolbar.style.position = 'absolute';
  toolbar.style.top = `${window.scrollY + window.getSelection().getRangeAt(0).getBoundingClientRect().top - 40}px`;
  toolbar.style.left = `${window.getSelection().getRangeAt(0).getBoundingClientRect().left}px`;
  toolbar.style.background = '#f0f0f0';
  toolbar.style.border = '1px solid #ccc';
  toolbar.style.padding = '5px';
  toolbar.style.borderRadius = '5px';
  toolbar.style.zIndex = '1000';
  toolbar.style.display = 'flex';
  toolbar.style.gap = '5px';
  
  const colors = ['yellow', 'lightblue', 'lightgreen', 'pink', 'lightgray'];
  colors.forEach(color => {
      const button = document.createElement('button');
      button.style.backgroundColor = color;
      button.style.border = 'none';
      button.style.width = '20px';
      button.style.height = '20px';
      button.style.borderRadius = '50%';
      button.style.cursor = 'pointer';
      button.addEventListener('click', () => {
          highlightText(color);
          toolbar.remove();
      });
      toolbar.appendChild(button);
  });

  document.body.appendChild(toolbar);
}

function highlightText(color) {
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

document.addEventListener('mouseup', () => {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {
      createToolbar();
  } else {
      const toolbar = document.getElementById('highlight-toolbar');
      if (toolbar) {
          toolbar.remove();
      }
  }
});

document.addEventListener('click', (event) => {
  const toolbar = document.getElementById('highlight-toolbar');
  if (toolbar && !toolbar.contains(event.target)) {
      toolbar.remove();
  }
});
