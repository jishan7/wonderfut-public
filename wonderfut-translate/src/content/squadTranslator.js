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

  function selectPreferredEntry(entry, options = {}) {
    if (!entry) {
      return '';
    }
    const usePlayerSlang = Boolean(options.usePlayerSlang);
    const professional = entry.professional || entry.playerSlang || '';
    const playerSlang = entry.playerSlang || entry.professional || '';
    return usePlayerSlang ? playerSlang : professional;
  }

  function translateSquadText(rawText, dictionary, options = {}) {
    const trimmed = (rawText || '').trim();
    if (!trimmed) {
      return null;
    }

    const suffixMatch = trimmed.match(/(\d+)\s*$/);
    const suffix = suffixMatch ? suffixMatch[1] : '';
    const base = suffix ? trimmed.slice(0, -suffix.length).trim() : trimmed;

    const entry = dictionary[base] || dictionary[trimmed];
    const preferred = selectPreferredEntry(entry, options);
    if (!preferred) {
      return null;
    }

    const combined = suffix ? preferred + suffix : preferred;
    return formatWithOptionalOriginal(combined, trimmed, options);
  }

  function translateVersionBadge(span, dictionary, options) {
    if (!span || span.dataset.futbinSquadTranslated === '1') {
      return;
    }
    const translated = translateSquadText(span.textContent, dictionary, options);
    if (!translated) {
      return;
    }
    span.textContent = translated;
    span.dataset.futbinSquadTranslated = '1';
  }

  function translateSquadLink(linkEl, dictionary, options) {
    if (!linkEl || linkEl.dataset.futbinSquadTranslated === '1') {
      return;
    }
    const translated = translateSquadText(linkEl.textContent, dictionary, options);
    if (!translated) {
      return;
    }
    linkEl.textContent = translated;
    linkEl.dataset.futbinSquadTranslated = '1';
  }

  function applyFutbinSquadTranslations(root, dictionary, options) {
    if (
      !dictionary ||
      !Object.keys(dictionary).length ||
      !isFutbinPlayerDetailsPage()
    ) {
      return;
    }
    const targetRoot = root || document;

    const versionSpans = targetRoot.querySelectorAll(
      'a.xxs-row.align-center.green-text.xs-font.bold span.text-ellipsis'
    );
    versionSpans.forEach((span) =>
      translateVersionBadge(span, dictionary, options)
    );

    const infoContainers = targetRoot.querySelectorAll(
      '.player-info-box-player-info-grid'
    );
    infoContainers.forEach((container) => {
      const rows = container.querySelectorAll(
        '.xxs-row.align-center, .xxs-row.xxs-font.align-center'
      );
      rows.forEach((row) => {
        const labelEl = row.querySelector(
          '.xxs-font.uppercase.text-faded, .xs-font.uppercase.text-faded'
        );
        const linkEl = row.querySelector('a.slim-font.text-ellipsis');
        if (!labelEl || !linkEl) {
          return;
        }
        translateSquadLink(linkEl, dictionary, options);
      });
    });
  }

  window.wonderfutSquadTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutbinSquadTranslations(root, dictionary, options);
    },
    isTargetPage: isFutbinPlayerDetailsPage,
  };
})();
