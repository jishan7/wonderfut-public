(() => {
  const FUTBIN_PLAYER_PATH_REGEX = /^\/\d+\/player\/\d+/;
  const processedTextNodes = new WeakSet();
  const DEFAULT_ACCELERATE_DATA = {
    entries: {
      Explosive: '爆发',
      Controlled: '掌控',
      Lengthy: '漫长',
    },
    sectionHeading: 'AcceleRATE & Chemistry',
    sectionHeadingTranslation: '加速类型 和 化学',
    communityTop3Text: 'Top 3 community voted',
    communityTop3Translation: '投票前三的化学选择',
  };

  function isFutbinPlayerDetailsPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    return (
      locationObj.hostname.includes('futbin.com') &&
      FUTBIN_PLAYER_PATH_REGEX.test(locationObj.pathname)
    );
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

  function shouldTranslateSection(root) {
    return (
      root &&
      root.nodeType === Node.ELEMENT_NODE &&
      root.classList.contains('player-chemistry-section')
    );
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
        const officialRegex = new RegExp(
          escapeRegExp(entry.professional),
          'g'
        );
        const slangReplacement = formatWithOptionalOriginal(
          entry.playerSlang,
          entry.professional,
          { ...options, noSpaceBeforeBracket: true }
        );
        const replacedOfficial = newText.replace(
          officialRegex,
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

  function translateChemistrySection(section, dictionary, options) {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node || processedTextNodes.has(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.textContent || !node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node;
    while ((node = walker.nextNode())) {
      translateTextNode(node, dictionary, options);
    }
  }

  function translateAcceleRateChemistry(section, options) {
    if (!section) {
      return;
    }

    const accelerateData = options?.accelerateTranslations || {};
    const accelerateEntries =
      accelerateData.entries || DEFAULT_ACCELERATE_DATA.entries;
    const accelerateHeading =
      accelerateData.sectionHeading || DEFAULT_ACCELERATE_DATA.sectionHeading;
    const accelerateHeadingTranslation =
      accelerateData.sectionHeadingTranslation ||
      DEFAULT_ACCELERATE_DATA.sectionHeadingTranslation;
    const communityText =
      accelerateData.communityTop3Text ||
      DEFAULT_ACCELERATE_DATA.communityTop3Text;
    const communityTranslation =
      accelerateData.communityTop3Translation ||
      DEFAULT_ACCELERATE_DATA.communityTop3Translation;

    const heading = section.querySelector('h2');
    if (heading) {
      const title = (heading.textContent || '').trim();
      if (title === accelerateHeading) {
        heading.textContent = formatWithOptionalOriginal(
          accelerateHeadingTranslation,
          accelerateHeading,
          options
        );
      }
    }

    const selectors = ['.player-accelerate-text', '.xxs-font.bold.text-faded'];
    selectors.forEach((selector) => {
      section.querySelectorAll(selector).forEach((el) => {
        if (el.dataset.wonderfutAccelerateTranslated === '1') {
          return;
        }
        const text = (el.textContent || '').trim();
        const translation = accelerateEntries[text];
        if (!translation) {
          return;
        }
        el.textContent = formatWithOptionalOriginal(
          translation,
          text,
          options
        );
        el.dataset.wonderfutAccelerateTranslated = '1';
      });
    });

    section.querySelectorAll('.xxs-font.bold.text-faded').forEach((el) => {
      if (el.dataset.wonderfutCommunityTranslated === '1') {
        return;
      }
      const text = (el.textContent || '').trim();
      if (text === communityText) {
        el.textContent = communityTranslation;
        el.dataset.wonderfutCommunityTranslated = '1';
      }
    });

  }

  function applyChemistryTranslations(root, dictionary, options = {}) {
    if (
      !dictionary ||
      !Object.keys(dictionary).length ||
      !isFutbinPlayerDetailsPage()
    ) {
      return;
    }
    const targetRoot = root || document;
    const sections = new Set();

    if (shouldTranslateSection(targetRoot)) {
      sections.add(targetRoot);
    }
    if (typeof targetRoot.querySelectorAll === 'function') {
      targetRoot
        .querySelectorAll('.player-chemistry-section')
        .forEach((section) => sections.add(section));
    }

    sections.forEach((section) => {
      translateChemistrySection(section, dictionary, options);
      translateAcceleRateChemistry(section, options);
    });
  }

  window.wonderfutChemistryTranslator = {
    translate(root, dictionary, options = {}) {
      applyChemistryTranslations(root, dictionary, options);
    },
    isTargetPage: isFutbinPlayerDetailsPage,
  };
})();
