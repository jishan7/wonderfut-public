(() => {
  const FUTBIN_HOSTNAME_KEYWORD = 'futbin.com';
  const BUTTON_SELECTOR = '.player-stats-evolution-button';

  function isFutbinPlayerStatsPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '' } = locationObj;
    return hostname.includes(FUTBIN_HOSTNAME_KEYWORD);
  }

  function selectPreferredEntry(entry, options = {}) {
    if (!entry) {
      return '';
    }
    const usePlayerSlang = Boolean(options.usePlayerSlang);
    const professional = entry.professional || entry.playerSlang || '';
    const playerSlang = entry.playerSlang || entry.professional || '';
    return usePlayerSlang ? playerSlang : professional;
  }

  function formatWithOptionalOriginal(mainText, originalText, options = {}) {
    if (!options.showOriginalWithBrackets || !originalText) {
      return mainText;
    }
    const separator = options.noSpaceBeforeBracket ? '' : ' ';
    return mainText + separator + '(' + originalText + ')';
  }

  function translateButtonElement(el, dictionary, options) {
    if (!el || el.dataset.futbinPlayerStatsTranslated === '1') {
      return;
    }
    const original = (el.textContent || '').trim();
    if (!original) {
      return;
    }
    const entry = dictionary[original] || dictionary[original.toUpperCase()];
    if (!entry) {
      return;
    }
    const preferred = selectPreferredEntry(entry, options);
    if (!preferred) {
      return;
    }
    el.textContent = formatWithOptionalOriginal(preferred, original, options);
    el.dataset.futbinPlayerStatsTranslated = '1';
  }

  function applyFutbinPlayerStatsTranslations(root, dictionary, options = {}) {
    if (!dictionary || !Object.keys(dictionary).length) {
      return;
    }
    if (!isFutbinPlayerStatsPage()) {
      return;
    }
    const targetRoot = root && root.querySelectorAll ? root : document;
    const buttons = targetRoot.querySelectorAll(BUTTON_SELECTOR);
    buttons.forEach((btn) => translateButtonElement(btn, dictionary, options));
  }

  window.wonderfutFutbinPlayerStatsTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutbinPlayerStatsTranslations(root, dictionary, options);
    },
    isTargetPage: isFutbinPlayerStatsPage,
  };
})();

