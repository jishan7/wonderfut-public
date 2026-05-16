(() => {
  const FUTBIN_HOSTNAME_KEYWORD = 'futbin.com';
  const FUTBIN_EVOLUTION_BUILDER_REGEX = /^\/evolutions\/builder\//;
  const FUTBIN_GENERAL_EVOLUTIONS_REGEX = /^\/evolutions\/?$/;
  const FUTBIN_PLAYER_EVOLUTION_REGEX =
    /^\/\d+\/player\/\d+\/[^/]+\/evolutions?(?:\/.*)?$/;
  const FUTBIN_PLAYER_DETAIL_WITH_EVOLUTION_ENTRY_REGEX =
    /^\/\d+\/player\/\d+(?:_\d+)+\/[^/]+\/?$/;
  const EVOLUTION_NAME_SELECTORS = [
    '.player-evo-card-title',
    '.lightbox-header .og-pill-evo',
    '.evolution-builder-available-evolution .og-pill-evo',
  ];
  const PLAYER_OVERVIEW_SELECTORS = ['.evolutions-overview-wrapper'];
  const EVOLUTION_NAME_SELECTOR = EVOLUTION_NAME_SELECTORS.join(', ');

  function isEvolutionBuilderPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTBIN_HOSTNAME_KEYWORD) &&
      FUTBIN_EVOLUTION_BUILDER_REGEX.test(pathname)
    );
  }

  function isPlayerEvolutionPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTBIN_HOSTNAME_KEYWORD) &&
      FUTBIN_PLAYER_EVOLUTION_REGEX.test(pathname)
    );
  }

  function isEvolutionsLandingPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTBIN_HOSTNAME_KEYWORD) &&
      FUTBIN_GENERAL_EVOLUTIONS_REGEX.test(pathname)
    );
  }

  function isPlayerDetailWithEvolutionEntryPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTBIN_HOSTNAME_KEYWORD) &&
      FUTBIN_PLAYER_DETAIL_WITH_EVOLUTION_ENTRY_REGEX.test(pathname)
    );
  }

  function isFutbinEvolutionPage(locationObj = window.location) {
    return (
      isEvolutionBuilderPage(locationObj) ||
      isPlayerEvolutionPage(locationObj) ||
      isEvolutionsLandingPage(locationObj) ||
      isPlayerDetailWithEvolutionEntryPage(locationObj)
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

  function translateTextNode(node, dictionary, options) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    const currentValue = node.textContent || '';
    const trimmed = currentValue.trim();
    if (!trimmed) {
      return;
    }
    const entry = dictionary[trimmed];
    if (!entry) {
      return;
    }
    const preferred = selectPreferredEntry(entry, options);
    if (!preferred) {
      return;
    }
    const translated = formatWithOptionalOriginal(preferred, trimmed, options);
    const leadingMatch = currentValue.match(/^\s*/);
    const trailingMatch = currentValue.match(/\s*$/);
    const leadingWhitespace = leadingMatch ? leadingMatch[0] : '';
    const trailingWhitespace = trailingMatch ? trailingMatch[0] : '';
    const nextValue = leadingWhitespace + translated + trailingWhitespace;
    if (nextValue !== currentValue) {
      node.textContent = nextValue;
    }
  }

  function translateElement(element, dictionary, options) {
    if (!element) {
      return;
    }
    const ownerDocument = element.ownerDocument || document;
    const walker = ownerDocument.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      translateTextNode(currentNode, dictionary, options);
      currentNode = walker.nextNode();
    }
  }

  function findCandidateElements(root, selectors) {
    const targets = new Set();
    const baseNodes = [];

    if (!root) {
      baseNodes.push(document);
    } else if (root.nodeType === Node.DOCUMENT_NODE) {
      baseNodes.push(root);
    } else if (root.nodeType === Node.ELEMENT_NODE) {
      baseNodes.push(root);
    } else if (root.parentElement) {
      baseNodes.push(root.parentElement);
    }

    const selectorText = selectors.filter(Boolean).join(', ');
    if (!selectorText) {
      return [];
    }

    baseNodes.forEach((base) => {
      if (!base) {
        return;
      }
      if (matchesSelector(base, selectorText)) {
        targets.add(base);
      }
      if (typeof base.querySelectorAll === 'function') {
        base.querySelectorAll(selectorText).forEach((el) => {
          targets.add(el);
        });
      }
    });

    return Array.from(targets);
  }

  function applyEvolutionTranslations(root, dictionary, options = {}) {
    if (
      !dictionary ||
      !Object.keys(dictionary).length ||
      !isFutbinEvolutionPage()
    ) {
      return;
    }
    const selectors = [...EVOLUTION_NAME_SELECTORS];
    if (isPlayerEvolutionPage() || isEvolutionsLandingPage()) {
      selectors.push(...PLAYER_OVERVIEW_SELECTORS);
    }
    const elements = findCandidateElements(root, selectors);
    if (!elements.length) {
      return;
    }
    elements.forEach((element) => {
      translateElement(element, dictionary, options);
    });
  }

  window.wonderfutEvolutionsTranslator = {
    translate(root, dictionary, options = {}) {
      applyEvolutionTranslations(root, dictionary, options);
    },
    isTargetPage: isFutbinEvolutionPage,
  };
})();
