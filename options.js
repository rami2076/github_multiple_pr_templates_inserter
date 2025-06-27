const TEMPLATE_PREFIX = "github_pr_template_";
const SELECTED_KEY = "github_pr_selected_template";
const DOMAINS_KEY = "github_pr_allowed_domains"; // 新しいキーを追加

const templateSelector = document.getElementById("templateSelector");
const templateArea = document.getElementById("templateArea");
const selectedTemplate = document.getElementById("selectedTemplate");
const status = document.getElementById("status");

// 新しいDOM要素の取得
const domainsArea = document.getElementById('domainsArea');
const saveDomainsBtn = document.getElementById('saveDomainsBtn');
const domainsStatus = document.getElementById('domainsStatus');


function loadTemplate() {
  const key = TEMPLATE_PREFIX + templateSelector.value;
  chrome.storage.local.get([key], (result) => {
    templateArea.value = result[key] || "";
  });
}

function saveTemplate() {
  const key = TEMPLATE_PREFIX + templateSelector.value;
  const value = templateArea.value;
  chrome.storage.local.set({[key]: value}, () => {
    status.textContent = "保存しました";
    setTimeout(() => (status.textContent = ""), 1500);
  });
}

function loadSelectedTemplate() {
  chrome.storage.local.get([SELECTED_KEY], (result) => {
    selectedTemplate.value = result[SELECTED_KEY] || "1";
  });
}

function saveSelectedTemplate() {
  chrome.storage.local.set({[SELECTED_KEY]: selectedTemplate.value}, () => {
    status.textContent = "挿入テンプレート設定済";
    setTimeout(() => (status.textContent = ""), 1500);
  });
}

// ドメイン保存関数
function saveDomains() {
  const domainsText = domainsArea.value;
  // 各行をトリムし、空行を削除して配列に変換
  const domainsArray = domainsText.split('\n')
    .map(d => d.trim())
    .filter(d => d.length > 0);

  chrome.storage.local.set({[DOMAINS_KEY]: domainsArray}, () => {
    domainsStatus.textContent = 'ドメインを保存しました！';
    setTimeout(() => (domainsStatus.textContent = ''), 1500);
  });
}

// ドメイン読み込み関数
function loadDomains() {
  chrome.storage.local.get([DOMAINS_KEY], (result) => {
    if (result[DOMAINS_KEY]) {
      // 配列を改行で結合してtextareaに表示
      domainsArea.value = result[DOMAINS_KEY].join('\n');
    } else {
      // 初回起動時や設定がない場合はデフォルトを設定（github.comのみ）
      domainsArea.value = 'github.com';
      chrome.storage.local.set({[DOMAINS_KEY]: ['github.com']});
    }
  });
}


templateSelector.addEventListener("change", loadTemplate);
document.getElementById("saveBtn").addEventListener("click", saveTemplate);
selectedTemplate.addEventListener("change", saveSelectedTemplate);
// ドメイン保存ボタンのイベントリスナーを追加
saveDomainsBtn.addEventListener("click", saveDomains);

// ページロード時にすべての設定を読み込む
document.addEventListener("DOMContentLoaded", () => {
  loadTemplate();
  loadSelectedTemplate();
  loadDomains(); // ドメインの読み込みを追加
});