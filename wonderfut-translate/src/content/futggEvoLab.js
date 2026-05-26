(() => {
  const FUTGG_EVOLUTION_LAB_REGEX = /^\/evo-lab(?:\/.*)?$/i;
  const FUTGG_HOSTNAME_KEYWORD = 'fut.gg';
  const EVOLUTION_CONTAINER_SELECTORS = [
    '[data-js-selector="create-my-evolutions"]',
    '.scrollable-evo',
  ];
  const EVOLUTION_CARD_ROOT_SELECTOR =
    'div.rounded.border.border-gray.bg-gray-800.grid.h-full.relative';
  const defaultProcessedTextSnapshots = new WeakMap();
  const dictionarySnapshotsCache = new WeakMap();
  const containerObservers = new WeakMap();
  const accelerateTextSnapshots = new WeakMap();

  function isFutggEvolutionLabPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTGG_HOSTNAME_KEYWORD) &&
      FUTGG_EVOLUTION_LAB_REGEX.test(pathname)
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

  function getBaseNodes(root) {
    const baseNodes = [];
    if (!root || root === document) {
      baseNodes.push(document);
    } else if (root.nodeType === Node.DOCUMENT_NODE) {
      baseNodes.push(root);
    } else if (root.nodeType === Node.ELEMENT_NODE) {
      baseNodes.push(root);
    } else if (root.parentElement) {
      baseNodes.push(root.parentElement);
    }
    return baseNodes;
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

  function getSnapshotMap(dictionary) {
    if (!dictionary || typeof dictionary !== 'object') {
      return defaultProcessedTextSnapshots;
    }
    let snapshotMap = dictionarySnapshotsCache.get(dictionary);
    if (!snapshotMap) {
      snapshotMap = new WeakMap();
      dictionarySnapshotsCache.set(dictionary, snapshotMap);
    }
    return snapshotMap;
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizeLookupKey(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[‐‑‒–—−]/g, '-');
  }

  function buildAccelerateReplacements(accelerateData) {
    if (!accelerateData) {
      return [];
    }
    const replacements = [];
    const reservedKeys = new Set([
      'entries',
      'sectionHeading',
      'sectionHeadingTranslation',
      'communityTop3Text',
      'communityTop3Translation',
      'extraEntries',
      'additionalEntries',
    ]);
    const entries = accelerateData.entries || {};
    Object.keys(entries).forEach((key) => {
      const translation = entries[key];
      if (!key || !translation) {
        return;
      }
      replacements.push({
        original: key,
        translation,
        regex: new RegExp('\\b' + escapeRegExp(key) + '\\b', 'g'),
      });
    });
    if (
      accelerateData.sectionHeading &&
      accelerateData.sectionHeadingTranslation
    ) {
      replacements.push({
        original: accelerateData.sectionHeading,
        translation: accelerateData.sectionHeadingTranslation,
        regex: new RegExp(escapeRegExp(accelerateData.sectionHeading), 'g'),
      });
    }
    if (
      accelerateData.communityTop3Text &&
      accelerateData.communityTop3Translation
    ) {
      replacements.push({
        original: accelerateData.communityTop3Text,
        translation: accelerateData.communityTop3Translation,
        regex: new RegExp(escapeRegExp(accelerateData.communityTop3Text), 'g'),
      });
    }
    const extraEntries =
      accelerateData.extraEntries || accelerateData.additionalEntries || {};
    Object.keys(extraEntries).forEach((key) => {
      const translation = extraEntries[key];
      if (!key || !translation) {
        return;
      }
      replacements.push({
        original: key,
        translation,
        regex: new RegExp('\\b' + escapeRegExp(key) + '\\b', 'g'),
      });
    });
    Object.entries(accelerateData).forEach(([key, value]) => {
      if (
        reservedKeys.has(key) ||
        typeof value !== 'string' ||
        !key ||
        !value
      ) {
        return;
      }
      replacements.push({
        original: key,
        translation: value,
        regex: new RegExp('\\b' + escapeRegExp(key) + '\\b', 'g'),
      });
    });
    return replacements;
  }

  function translateAccelerateTextNode(textNode, replacements, options) {
    if (
      !textNode ||
      textNode.nodeType !== Node.TEXT_NODE ||
      !replacements ||
      !replacements.length
    ) {
      return;
    }
    const currentValue = textNode.textContent || '';
    if (accelerateTextSnapshots.get(textNode) === currentValue) {
      return;
    }
    const trimmed = currentValue.trim();
    if (!trimmed) {
      accelerateTextSnapshots.set(textNode, currentValue);
      return;
    }
    let nextValue = currentValue;
    let changed = false;
    replacements.forEach(({ translation, regex, original }) => {
      if (!translation || !regex) {
        return;
      }
      const formatted = formatWithOptionalOriginal(
        translation,
        original,
        options
      );
      const replaced = nextValue.replace(regex, formatted);
      if (replaced !== nextValue) {
        nextValue = replaced;
        changed = true;
      }
    });
    if (changed && nextValue !== currentValue) {
      textNode.textContent = nextValue;
    }
    accelerateTextSnapshots.set(textNode, textNode.textContent || currentValue);
  }

  function translateAccelerateNode(node, replacements, options) {
    if (!node || !replacements || !replacements.length) {
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      translateAccelerateTextNode(node, replacements, options);
      return;
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    let currentNode = walker.nextNode();
    while (currentNode) {
      translateAccelerateTextNode(currentNode, replacements, options);
      currentNode = walker.nextNode();
    }
  }

  function translateTextNode(node, dictionary, options) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    const snapshotMap = getSnapshotMap(dictionary);
    const currentValue = node.textContent || '';
    if (snapshotMap.get(node) === currentValue) {
      return;
    }
    const trimmed = currentValue.trim();
    if (!trimmed) {
      snapshotMap.set(node, currentValue);
      return;
    }
    let entry = dictionary[trimmed];
    if (!entry) {
      const upperKey = trimmed.toUpperCase();
      if (upperKey !== trimmed) {
        entry = dictionary[upperKey];
      }
    }
    if (!entry) {
      const normalizedTrimmed = normalizeLookupKey(trimmed);
      const dictionaryKeys = Object.keys(dictionary);
      const matchedKey = dictionaryKeys.find(
        (key) => normalizeLookupKey(key) === normalizedTrimmed
      );
      if (matchedKey) {
        entry = dictionary[matchedKey];
      }
    }
    if (!entry) {
      snapshotMap.set(node, currentValue);
      return;
    }
    const preferred = selectPreferredEntry(entry, options);
    if (!preferred) {
      snapshotMap.set(node, currentValue);
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
    snapshotMap.set(node, node.textContent || '');
  }

  function translateWithinContainer(container, dictionary, options) {
    if (!container) {
      return;
    }
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      translateTextNode(currentNode, dictionary, options);
      currentNode = walker.nextNode();
    }
  }

  function findLabContainers(root) {
    const containers = new Set();
    const baseNodes = getBaseNodes(root);

    baseNodes.forEach((node) => {
      if (!node) {
        return;
      }
      EVOLUTION_CONTAINER_SELECTORS.forEach((selector) => {
        if (matchesSelector(node, selector)) {
          containers.add(node);
        }
        if (typeof node.querySelectorAll === 'function') {
          node.querySelectorAll(selector).forEach((el) => {
            containers.add(el);
          });
        }
      });
      if (typeof node.querySelectorAll === 'function') {
        node
          .querySelectorAll('button[title="View evolution details"]')
          .forEach((button) => {
            const cardRoot = button.closest(EVOLUTION_CARD_ROOT_SELECTOR);
            if (cardRoot) {
              containers.add(cardRoot);
            }
          });
      }
      if (typeof node.closest === 'function') {
        EVOLUTION_CONTAINER_SELECTORS.forEach((selector) => {
          const ancestor = node.closest(selector);
          if (ancestor) {
            containers.add(ancestor);
          }
        });
        if (node.matches && node.matches('button[title="View evolution details"]')) {
          const cardRoot = node.closest(EVOLUTION_CARD_ROOT_SELECTOR);
          if (cardRoot) {
            containers.add(cardRoot);
          }
        }
      }
    });

    return Array.from(containers);
  }

  function translateNodeWithDictionary(node, dictionary, options) {
    if (!dictionary || !node) {
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node, dictionary, options);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateWithinContainer(node, dictionary, options);
    }
  }

  function translateNodeWithDictionaries(node, dictionaries, options) {
    if (!node || !dictionaries || !dictionaries.length) {
      return;
    }
    dictionaries.forEach((dict) => {
      translateNodeWithDictionary(node, dict, options);
    });
  }

  function ensureContainerObserver(
    container,
    dictionaries,
    options,
    accelerateReplacements
  ) {
    if (!container || containerObservers.has(container)) {
      return;
    }
    const dictionariesList = (dictionaries || []).filter(
      (dict) => dict && Object.keys(dict).length
    );
    const hasAccelerate = accelerateReplacements?.length;
    if (!dictionariesList.length && !hasAccelerate) {
      return;
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          dictionariesList.forEach((dict) => {
            translateTextNode(mutation.target, dict, options);
          });
          if (hasAccelerate) {
            translateAccelerateTextNode(
              mutation.target,
              accelerateReplacements,
              options
            );
          }
          return;
        }
        mutation.addedNodes.forEach((node) => {
          translateNodeWithDictionaries(node, dictionariesList, options);
          if (hasAccelerate) {
            translateAccelerateNode(node, accelerateReplacements, options);
          }
        });
      });
    });
    observer.observe(container, {
      characterData: true,
      subtree: true,
      childList: true,
    });
    containerObservers.set(container, observer);
  }

  function applyFutggEvoLabTranslations(root, dictionary, options = {}) {
    if (!dictionary || !Object.keys(dictionary).length) {
      return;
    }
    const translationOptions = { ...options };
    const sixStatDictionary = translationOptions.sixStatDictionary;
    delete translationOptions.sixStatDictionary;
    const extraDictionariesOption = translationOptions.extraDictionaries;
    delete translationOptions.extraDictionaries;
    const accelerateTranslations = translationOptions.accelerateTranslations;
    delete translationOptions.accelerateTranslations;
    const accelerateReplacements = buildAccelerateReplacements(
      accelerateTranslations
    );
    const supplementalDictionaries = [];
    if (sixStatDictionary && Object.keys(sixStatDictionary).length) {
      supplementalDictionaries.push(sixStatDictionary);
    }
    if (Array.isArray(extraDictionariesOption)) {
      extraDictionariesOption.forEach((dict) => {
        if (dict && Object.keys(dict).length) {
          supplementalDictionaries.push(dict);
        }
      });
    }
    if (!isFutggEvolutionLabPage()) {
      return;
    }
    const containers = findLabContainers(root);
    if (!containers.length) {
      return;
    }

    containers.forEach((container) => {
      translateWithinContainer(container, dictionary, translationOptions);
      supplementalDictionaries.forEach((dict) => {
        translateWithinContainer(container, dict, translationOptions);
      });
      if (accelerateReplacements.length) {
        translateAccelerateNode(
          container,
          accelerateReplacements,
          translationOptions
        );
      }
      ensureContainerObserver(
        container,
        [dictionary, ...supplementalDictionaries],
        translationOptions,
        accelerateReplacements
      );
    });
  }

  window.wonderfutFutggEvoLabTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutggEvoLabTranslations(root, dictionary, options);
    },
    isTargetPage: isFutggEvolutionLabPage,
  };
})();
