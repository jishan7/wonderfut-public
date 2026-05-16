(() => {
  const FUTBIN_PLAYER_PATH_REGEX = /^\/\d+\/player\/\d+/;

  function formatWithOptionalOriginal(mainText, originalText, options = {}) {
    const shouldShowOriginal = Boolean(options.showOriginalWithBrackets);
    if (!shouldShowOriginal || !originalText) {
      return mainText;
    }
    const separator = options.noSpaceBeforeBracket ? '' : ' ';
    return mainText + separator + '(' + originalText + ')';
  }

  function isFutbinPlayerDetailsPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    return (
      locationObj.hostname.includes('futbin.com') &&
      FUTBIN_PLAYER_PATH_REGEX.test(locationObj.pathname)
    );
  }

  function translateLabelElement(el, dictionary, options) {
    if (!el || el.dataset.futbinBasicInfoTranslated === '1') {
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
    el.dataset.futbinBasicInfoTranslated = '1';
  }

  function applyFutbinBasicInfoTranslations(root, dictionary, options) {
    if (!dictionary || !Object.keys(dictionary).length) {
      return;
    }
    const targetRoot = root || document;
    if (!isFutbinPlayerDetailsPage()) {
      return;
    }
    const containers = targetRoot.querySelectorAll(
      '.player-info-box-player-info-grid'
    );
    containers.forEach((container) => {
      const labels = container.querySelectorAll(
        '.xs-font.uppercase.text-faded, .xxs-font.uppercase.text-faded'
      );
      labels.forEach((label) => translateLabelElement(label, dictionary, options));
    });
  }

  window.wonderfutBaseInfoTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutbinBasicInfoTranslations(root, dictionary, options);
    },
    isTargetPage: isFutbinPlayerDetailsPage,
  };
})();
