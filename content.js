const TEMPLATE_KEY_PREFIX = "github_pr_template_";
const SELECTED_KEY = "github_pr_selected_template";
const DOMAINS_KEY = "github_pr_allowed_domains";

// プレースホルダー置換用モーダル処理
function fillPlaceholdersWithModal(template) {
  const matches = [...template.matchAll(/{{\s*([\w-]+)\s*}}/g)];
  const uniqueKeys = [...new Set(matches.map((m) => m[1]))];

  if (uniqueKeys.length === 0) return Promise.resolve(template);

  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.id = "placeholder-modal";
    modal.style = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;justify-content:center;align-items:center;";

    const form = document.createElement("form");
    form.style = "background:#fff;padding:20px;border-radius:8px;min-width:300px;max-width:90%;";
    form.innerHTML = "<h3 style='margin-top:0;'>プレースホルダーを入力してください</h3>";

    const inputs = {};

    uniqueKeys.forEach((key) => {
      const label = document.createElement("label");
      label.textContent = key;
      label.style.display = "block";
      label.style.margin = "8px 0 4px";

      const input = document.createElement("input");
      input.name = key;
      input.style.width = "100%";
      input.style.padding = "6px";
      inputs[key] = input;

      form.appendChild(label);
      form.appendChild(input);
    });

    const btnRow = document.createElement("div");
    btnRow.style = "margin-top:16px;text-align:right;";

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "キャンセル";
    cancel.style.marginRight = "8px";

    const ok = document.createElement("button");
    ok.type = "submit";
    ok.textContent = "OK";

    btnRow.appendChild(cancel);
    btnRow.appendChild(ok);
    form.appendChild(btnRow);
    modal.appendChild(form);
    document.body.appendChild(modal);

    cancel.addEventListener("click", () => {
      document.body.removeChild(modal);
      resolve(null);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let result = template;
      for (const key of uniqueKeys) {
        const val = inputs[key].value.trim();
        if (val) {
          const re = new RegExp(`{{\s*${key}\s*}}`, "g");
          result = result.replace(re, val);
        }
      }
      document.body.removeChild(modal);
      resolve(result);
    });
  });
}

async function getTemplate() {
  return new Promise((resolve) => {
    chrome.storage.local.get([SELECTED_KEY], (selected) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving selected template:", chrome.runtime.lastError.message);
        resolve("# 概要\n# 動作確認");
        return;
      }

      const templateIndex = selected[SELECTED_KEY] || "1";
      const templateKey = TEMPLATE_KEY_PREFIX + templateIndex;

      chrome.storage.local.get([templateKey], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Error retrieving template content:", chrome.runtime.lastError.message);
          resolve("# 概要\n# 動作確認");
          return;
        }
        resolve(result[templateKey] || "# 概要\n# 動作確認");
      });
    });
  });
}

async function insertTemplate() {
  const textarea = document.querySelector('textarea[name="pull_request[body]"]');
  if (!textarea) return;

  let template = await getTemplate();
  template = await fillPlaceholdersWithModal(template);

  if (template === null) return; // キャンセルされたら何もしない

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

  if (!textarea) {
    console.log("無効")
    return;
  } else {
    console.log("有効")
  }

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

async function initContentScript() {
  const currentPathName = window.location.pathname
  const currentHostname = window.location.hostname;

  const isPullRequestPath = /^\/[^/]+\/[^/]+\/pull\/\d+\/?$/.test(currentPathName);

  if (!isPullRequestPath) return;

  const result = await new Promise(resolve => {
    chrome.storage.local.get([DOMAINS_KEY], resolve);
  });

  const allowedDomains = result[DOMAINS_KEY] || ['github.com'];

  const isDomainAllowed = allowedDomains.some(domain => {
    return currentHostname === domain || currentHostname.endsWith(`.${domain}`);
  });

  if (isDomainAllowed) {
    const observer = new MutationObserver(addTemplateButton);
    observer.observe(document.body, {childList: true, subtree: true});
    addTemplateButton();
    console.log("有効化");
  } else {
    console.log(`GitHub PR Template Inserter: Current domain "${currentHostname}" is not in the allowed list.`);
  }
}

initContentScript()
  .then(() => console.log("OK"))
  .catch(() => console.log("NG"));
