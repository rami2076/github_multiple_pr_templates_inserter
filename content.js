const TEMPLATE_TEXT = `# 概要\n# 動作確認`;

function insertTemplate() {
  const textarea = document.querySelector('textarea[name="pull_request[body]"]');
  if (textarea) {
    const current = textarea.value.trim();
    if (!current.includes('# 概要')) {
      textarea.value = TEMPLATE_TEXT + '\n\n' + current;
    }
  }
}

function addTemplateButton() {
  const form = document.querySelector('form#issue_body_edit_form');
  if (!form || form.querySelector('#gh-template-insert-btn')) return;

  const tabNavContainer = form.querySelector('.tabnav');
  if (!tabNavContainer) return;

  const button = document.createElement('button');
  button.id = 'gh-template-insert-btn';
  button.textContent = 'テンプレート挿入';
  button.className = 'btn btn-sm';
  button.type = 'button';
  button.style.marginLeft = '8px';
  button.onclick = insertTemplate;

  tabNavContainer.appendChild(button);
}

const observer = new MutationObserver(() => {
  addTemplateButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
