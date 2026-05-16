(() => {
  function formatWithOptionalOriginal(mainText, originalText, options = {}) {
    const shouldShowOriginal = Boolean(options.showOriginalWithBrackets);
    if (!shouldShowOriginal || !originalText) {
      return mainText;
    }
    const separator = options.noSpaceBeforeBracket ? '' : ' ';
    return mainText + separator + '(' + originalText + ')';
  }

  function canTranslateSixStat() {
    return window.location.hostname.includes('futbin.com');
  }

  function applySixStatTranslations(root, dictionary, options) {
    if (!dictionary || !Object.keys(dictionary).length) {
      return;
    }
    if (!canTranslateSixStat()) {
      return;
    }
    const targetRoot = root || document;
    const statElements = targetRoot.querySelectorAll(
      'div.player-stat-name.text-ellipsis'
    );

    statElements.forEach((el) => {
      if (!el || el.dataset.wonderfutSixStatTranslated === '1') {
        return;
      }
      const english = (el.textContent || '').trim();
      if (!english) {
        return;
      }
      const entry = dictionary[english];
      if (!entry) {
        return;
      }
      const preferred = options.usePlayerSlang
        ? entry.playerSlang || entry.professional
        : entry.professional || entry.playerSlang;
      if (!preferred) {
        return;
      }
      el.textContent = formatWithOptionalOriginal(
        preferred,
        english,
        options
      );
      el.dataset.wonderfutSixStatTranslated = '1';
    });
  }

  window.wonderfutSixStatTranslator = {
    translate(root, dictionary, options = {}) {
      applySixStatTranslations(root, dictionary, options);
    },
  };
})();
