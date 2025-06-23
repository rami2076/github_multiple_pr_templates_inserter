const STORAGE_KEY = 'github_pr_template_from_options';

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('templateArea');
  const status = document.getElementById('status');

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    textarea.value = result[STORAGE_KEY] || "# 概要\n# 動作確認";
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    const value = textarea.value;
    chrome.storage.local.set({ [STORAGE_KEY]: value }, () => {
      status.textContent = '保存しました。';
      setTimeout(() => status.textContent = '', 2000);
    });
  });
});
