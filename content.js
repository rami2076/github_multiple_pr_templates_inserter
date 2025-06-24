const TEMPLATE_KEY_PREFIX = "github_pr_template_";
const SELECTED_KEY = "github_pr_selected_template";
const DOMAINS_KEY = "github_pr_allowed_domains"; // ドメインキーを定義

async function getTemplate() {
  return new Promise((resolve) => {
    chrome.storage.local.get([SELECTED_KEY], (selected) => {
      // コンテキストが無効になったかチェック
      if (chrome.runtime.lastError) {
        console.error("Error retrieving selected template:", chrome.runtime.lastError.message);
        resolve("# 概要\n# 動作確認"); // デフォルト値を返すか、エラー処理を行う
        return;
      }

      const templateIndex = selected[SELECTED_KEY] || "1";
      const templateKey = TEMPLATE_KEY_PREFIX + templateIndex;

      chrome.storage.local.get([templateKey], (result) => {
        // ここでもコンテキストが無効になったかチェック
        if (chrome.runtime.lastError) {
          console.error("Error retrieving template content:", chrome.runtime.lastError.message);
          resolve("# 概要\n# 動作確認"); // デフォルト値を返すか、エラー処理を行う
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

// === ドメインチェックとPRページ判定のロジックをここに追加 ===
async function initContentScript() {
  const currentUrl = window.location.href;
  const currentHostname = window.location.hostname;

  // GitHubのPRページであるかの基本的なチェック
  // 例: https://github.com/user/repo/pull/123 のような形式を想定
  const isPullRequestPage = /https:\/\/[\w.-]+\/[\w.-]+\/[\w.-]+\/pull\/\d+(\/files|\/commits|\/checks|\/conversations)?\/?$/.test(currentUrl);

  if (!isPullRequestPage) {
    // PRページでなければ何もしない
    return;
  }

  // ユーザーが設定した許可ドメインリストを取得
  const result = await new Promise(resolve => {
    chrome.storage.local.get([DOMAINS_KEY], resolve);
  });

  const allowedDomains = result[DOMAINS_KEY] || ['github.com']; // 設定がなければデフォルトでgithub.com

  // 現在のホスト名が許可されたドメインリストに含まれているかチェック
  const isDomainAllowed = allowedDomains.some(domain => {
    // ホスト名の末尾が指定ドメインと一致するかを厳密にチェック
    // 例: "sub.github.com" は "github.com" にマッチ
    // 例: "github.com" は "github.com" にマッチ
    return currentHostname === domain || currentHostname.endsWith(`.${domain}`);
  });

  if (isDomainAllowed) {
    // ドメインが許可されており、PRページであればボタンを追加
    const observer = new MutationObserver(addTemplateButton);
    observer.observe(document.body, {childList: true, subtree: true});
    addTemplateButton();
  } else {
    console.log(`GitHub PR Template Inserter: Current domain "${currentHostname}" is not in the allowed list.`);
  }
}

// スクリプトが読み込まれたら初期化処理を実行
initContentScript();