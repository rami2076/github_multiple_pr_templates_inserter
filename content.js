const STORAGE_KEY = 'github_pr_template_from_options';

async function getTemplate() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      resolve(result[STORAGE_KEY] || "# 概要\n# 動作確認");
    });
  });
}

async function insertTemplate() {
  const textarea = document.querySelector('textarea[name="pull_request[body]"]');
  if (!textarea) return;

  const template = await getTemplate();
  if (!textarea.value.includes('# 概要') && !textarea.value.includes('# 説明')) {
    textarea.value = template + '\n\n' + textarea.value;
  }
  textarea.focus();
}

function findTabNav(textarea) {
  let el = textarea?.parentElement;
  while (el && el !== document.body) {
    const nav = el.querySelector('.tabnav-tabs');
    if (nav) return nav;
    el = el.parentElement;
  }
  return textarea.closest('form')?.querySelector('.tabnav-tabs') || null;
}

function addTemplateButton() {
  const textarea = document.querySelector('textarea[name="pull_request[body]"]');
  if (!textarea) return;

  const tabNav = findTabNav(textarea);
  if (!tabNav || document.getElementById('gh-template-insert-btn')) return;

  const button = document.createElement('button');
  button.id = 'gh-template-insert-btn';
  button.textContent = 'テンプレート挿入';
  button.className = 'btn btn-sm';
  button.type = 'button';
  button.style.marginLeft = '8px';
  button.onclick = insertTemplate;

  tabNav.appendChild(button);
}

const observer = new MutationObserver(addTemplateButton);
observer.observe(document.body, { childList: true, subtree: true });
addTemplateButton();
