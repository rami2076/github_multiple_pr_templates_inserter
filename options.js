const TEMPLATE_PREFIX = "github_pr_template_";
const SELECTED_KEY = "github_pr_selected_template";

const templateSelector = document.getElementById("templateSelector");
const templateArea = document.getElementById("templateArea");
const selectedTemplate = document.getElementById("selectedTemplate");
const status = document.getElementById("status");

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

templateSelector.addEventListener("change", loadTemplate);
document.getElementById("saveBtn").addEventListener("click", saveTemplate);
selectedTemplate.addEventListener("change", saveSelectedTemplate);

loadTemplate();
loadSelectedTemplate();
