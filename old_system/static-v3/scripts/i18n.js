let currentLang = 'zh'; // 默认语言

function loadLanguage(lang) {
  fetch(`./static-v3/locales/${lang}.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('copyright').textContent = data.copyright;
    })
    .catch(error => console.error('Error loading language file:', error));
}

document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(currentLang);

  document.getElementById('toggle-lang').addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    loadLanguage(currentLang);
  });
});