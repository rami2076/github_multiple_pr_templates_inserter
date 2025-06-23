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
  // PR説明の編集フォームを持つエリアを取得
  const form = document.querySelector('form.js-comment-form[action*="/pull/"][action*="update"]');
  if (!form) return;

  // タブナビゲーション（Write/Preview）を取得
  const tabNav = form.querySelector('.tabnav, .js-comment-field .tabnav-tabs');
  if (!tabNav || form.querySelector('#gh-template-insert-btn')) return;

  const button = document.createElement('button');
  button.id = 'gh-template-insert-btn';
  button.textContent = 'テンプレート挿入';
  button.className = 'btn btn-sm';
  button.type = 'button';
  button.style.marginLeft = '8px';
  button.onclick = insertTemplate;

  tabNav.appendChild(button);
}

const observer = new MutationObserver(() => {
  addTemplateButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
