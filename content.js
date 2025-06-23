const TEMPLATE_TEXT = `# 概要\n# 動作確認`;

function insertTemplate() {
  const textarea = document.querySelector('textarea#pull_request_body');
  if (textarea && !textarea.value.includes('# 概要')) {
    textarea.value = TEMPLATE_TEXT + '\n\n' + textarea.value;
  }
}

function addTemplateButton() {
  const container = document.querySelector(
    '#issue-3165949030-edit-form > div > div.Box.CommentBox.m-2 > div.tabnav.CommentBox-header.p-0.position-static'
  );

  if (!container || document.getElementById('gh-template-insert-btn')) return;

  const button = document.createElement('button');
  button.id = 'gh-template-insert-btn';
  button.textContent = 'テンプレート挿入';
  button.className = 'btn btn-sm ml-2';
  button.style.marginLeft = '8px';
  button.onclick = insertTemplate;

  container.appendChild(button);
}

// MutationObserverで対象の要素が現れたらボタン挿入
const observer = new MutationObserver(() => {
  const editForm = document.querySelector('#issue-3165949030-edit-form');
  if (editForm) {
    addTemplateButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
