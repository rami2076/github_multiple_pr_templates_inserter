
const TEMPLATE_TEXT = `# 概要\n# 動作確認`;

/** Attempt to find the tab navigation element near the textarea */
function findTabNav(textarea) {
  if (!textarea) return null;

  // Strategy 1: search upwards for any ancestor containing .tabnav or .tabnav-tabs
  let el = textarea.parentElement;
  while (el && el !== document.body) {
    const nav = el.querySelector('.tabnav-tabs');
    if (nav) return nav;
    el = el.parentElement;
  }

  // Strategy 2: within the form that wraps the textarea
  const form = textarea.closest('form');
  if (form) {
    const nav = form.querySelector('.tabnav-tabs');
    if (nav) return nav;
  }

  return null;
}

/** Insert template into textarea */
function insertTemplate() {
  const textarea = document.querySelector('textarea[name="pull_request[body]"]');
  if (textarea) {
    const current = textarea.value.trim();
    if (!current.includes('# 概要')) {
      textarea.value = TEMPLATE_TEXT + '\n\n' + current;
    }
    textarea.focus();
  } else {
    console.warn('テンプレート挿入失敗：textarea[name="pull_request[body]"] が見つかりません');
  }
}

/** Add button if not present */
function addTemplateButton() {
  const textarea = document.querySelector('textarea[name="pull_request[body]"]');
  if (!textarea) return;

  const tabNav = findTabNav(textarea);
  if (!tabNav) return;

  if (document.getElementById('gh-template-insert-btn')) return;

  // Create button
  const button = document.createElement('button');
  button.id = 'gh-template-insert-btn';
  button.textContent = 'テンプレート挿入';
  button.className = 'btn btn-sm';
  button.type = 'button';
  button.style.marginLeft = '8px';
  button.onclick = insertTemplate;

  // Append after the last tab
  tabNav.appendChild(button);
}

// Observe DOM changes and try to add the button whenever possible
const observer = new MutationObserver(() => {
  addTemplateButton();
});

observer.observe(document.body, { childList: true, subtree: true });

// Attempt immediately as well
addTemplateButton();
