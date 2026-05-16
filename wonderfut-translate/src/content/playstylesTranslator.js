(() => {
  const FUTBIN_PLAYER_PATH_REGEX = /^\/\d+\/player\/\d+/;
  const PLAYSTYLE_PANEL_SELECTORS = [
    '.playstyles-overview-grid.full-width-mobile-box',
    '.player-info-box-playerstyles',
    '.player-abilities-wrapper.xs-column',
  ];
  const PLAYSTYLE_PANEL_SELECTOR = PLAYSTYLE_PANEL_SELECTORS.join(', ');
  const processedTextNodes = new WeakSet();

  function isFutbinPlayerPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    return (
      locationObj.hostname.includes('futbin.com') &&
      FUTBIN_PLAYER_PATH_REGEX.test(locationObj.pathname)
    );
  }

  function matchesSelector(node, selector) {
    return (
      node &&
      node.nodeType === Node.ELEMENT_NODE &&
      typeof node.matches === 'function' &&
      node.matches(selector)
    );
  }

  function isPlaystylesPanel(node) {
    return PLAYSTYLE_PANEL_SELECTORS.some((selector) =>
      matchesSelector(node, selector)
    );
  }

  function findPlaystylesPanels(baseNode) {
    const bases = baseNode ? [baseNode] : [document];
    const panels = new Set();

    for (const base of bases) {
      if (!base) {
        continue;
      }

      if (isPlaystylesPanel(base)) {
        panels.add(base);
      }

      if (typeof base.querySelectorAll === 'function') {
        const found = base.querySelectorAll(PLAYSTYLE_PANEL_SELECTOR);
        for (const panel of found) {
          panels.add(panel);
        }
      }
    }

    return Array.from(panels);
  }

  function formatWithOptionalOriginal(mainText, originalText, options = {}) {
    const shouldShowOriginal = Boolean(options.showOriginalWithBrackets);
    if (!shouldShowOriginal || !originalText) {
      return mainText;
    }
    const separator = options.noSpaceBeforeBracket ? '' : ' ';
    return mainText + separator + '(' + originalText + ')';
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

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function translateTextNode(textNode, dictionary, options) {
    if (!textNode || processedTextNodes.has(textNode)) {
      return;
    }
    const originalText = textNode.textContent;
    if (!originalText || !originalText.trim()) {
      processedTextNodes.add(textNode);
      return;
    }

    let newText = originalText;
    let hasChanges = false;

    for (const [english, entry] of Object.entries(dictionary)) {
      if (!english) {
        continue;
      }
      const preferred = selectPreferredEntry(entry, options);
      if (!preferred) {
        continue;
      }

      if (!newText.includes('(' + english + ')')) {
        const regex = new RegExp('\\b' + escapeRegExp(english) + '\\b', 'g');
        const replacement = formatWithOptionalOriginal(
          preferred,
          english,
          options
        );
        const replaced = newText.replace(regex, replacement);
        if (replaced !== newText) {
          newText = replaced;
          hasChanges = true;
        }
      }

      if (
        options.usePlayerSlang &&
        entry.professional &&
        entry.playerSlang &&
        entry.professional !== entry.playerSlang &&
        !newText.includes('(' + entry.professional + ')')
      ) {
        const professionalRegex = new RegExp(
          escapeRegExp(entry.professional),
          'g'
        );
        const slangReplacement = formatWithOptionalOriginal(
          entry.playerSlang,
          entry.professional,
          { ...options, noSpaceBeforeBracket: true }
        );
        const replacedOfficial = newText.replace(
          professionalRegex,
          slangReplacement
        );
        if (replacedOfficial !== newText) {
          newText = replacedOfficial;
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      textNode.textContent = newText;
    }
    processedTextNodes.add(textNode);
  }

  function shouldSkipNode(node) {
    if (!node || processedTextNodes.has(node)) {
      return true;
    }
    if (!node.textContent || !node.textContent.trim()) {
      return true;
    }
    const parent = node.parentNode;
    if (!parent || parent.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const tagName = parent.tagName || '';
    return tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT';
  }

  function applyPlaystylesTranslations(root, dictionary, options = {}) {
    if (
      !dictionary ||
      !Object.keys(dictionary).length ||
      !isFutbinPlayerPage()
    ) {
      return;
    }
    const targetRoots = findPlaystylesPanels(root);
    if (!targetRoots.length) {
      return;
    }
    for (const targetRoot of targetRoots) {
      const walker = document.createTreeWalker(
        targetRoot,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            return shouldSkipNode(node)
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      let node;
      while ((node = walker.nextNode())) {
        translateTextNode(node, dictionary, options);
      }
    }
  }

  window.wonderfutPlaystylesTranslator = {
    translate(root, dictionary, options = {}) {
      applyPlaystylesTranslations(root, dictionary, options);
    },
    isTargetPage: isFutbinPlayerPage,
  };
})();
