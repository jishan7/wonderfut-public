(() => {
  const TRANSLATABLE_ATTRIBUTE_NAMES = [
    'aria-label',
    'placeholder',
    'title',
    'value',
  ];
  const dictionaryLookupCache = new WeakMap();
  const processedSnapshots = new WeakMap();

  function isFutggHost(locationObj = window.location) {
    return Boolean(locationObj && (locationObj.hostname || '').includes('fut.gg'));
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

  function normalizeLookupKey(value) {
    return String(value || '')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[‐‑‒–—−]/g, '-')
      .toLowerCase();
  }

  function getNormalizedDictionaryLookup(dictionary) {
    if (!dictionary || typeof dictionary !== 'object') {
      return null;
    }
    let lookup = dictionaryLookupCache.get(dictionary);
    if (!lookup) {
      lookup = new Map();
      Object.keys(dictionary).forEach((key) => {
        const normalizedKey = normalizeLookupKey(key);
        if (normalizedKey && !lookup.has(normalizedKey)) {
          lookup.set(normalizedKey, key);
        }
      });
      dictionaryLookupCache.set(dictionary, lookup);
    }
    return lookup;
  }

  function selectPreferredEntry(entry, options = {}) {
    if (!entry) {
      return '';
    }
    const professional = entry.professional || entry.playerSlang || '';
    const playerSlang = entry.playerSlang || entry.professional || '';
    return options.usePlayerSlang ? playerSlang : professional;
  }

  function formatWithOptionalOriginal(mainText, originalText, options = {}) {
    if (!options.showOriginalWithBrackets || !originalText) {
      return mainText;
    }
    return mainText + ' (' + originalText + ')';
  }

  function getDictionaryEntry(rawText, dictionary) {
    if (!dictionary || !rawText) {
      return null;
    }
    const trimmed = String(rawText).trim();
    if (!trimmed) {
      return null;
    }
    let entry = dictionary[trimmed] || dictionary[trimmed.toUpperCase()];
    if (entry) {
      return { entry, original: trimmed, prefix: '', suffix: '' };
    }
    const statChangeMatch = trimmed.match(/^([+-]?\d+)\s+([A-Za-z. ]+)$/);
    if (statChangeMatch) {
      const statMatch = getDictionaryEntry(statChangeMatch[2].trim(), dictionary);
      if (statMatch) {
        return {
          entry: statMatch.entry,
          original: trimmed,
          prefix: statChangeMatch[1] + ' ',
          suffix: statMatch.suffix,
        };
      }
    }
    const trailingCountMatch = trimmed.match(/^(.+?)\s+(\d+)$/);
    if (trailingCountMatch) {
      const labelMatch = getDictionaryEntry(trailingCountMatch[1].trim(), dictionary);
      if (labelMatch) {
        return {
          entry: labelMatch.entry,
          original: trimmed,
          prefix: labelMatch.prefix,
          suffix: labelMatch.suffix + ' ' + trailingCountMatch[2],
        };
      }
    }
    const pipeCountMatch = trimmed.match(/^(.+?)\s*\|\s*(\d+)$/);
    if (pipeCountMatch) {
      const labelMatch = getDictionaryEntry(pipeCountMatch[1].trim(), dictionary);
      if (labelMatch) {
        return {
          entry: labelMatch.entry,
          original: trimmed,
          prefix: labelMatch.prefix,
          suffix: labelMatch.suffix + ' | ' + pipeCountMatch[2],
        };
      }
    }
    const leadingCountMatch = trimmed.match(/^(\d+)\s+(.+)$/);
    if (leadingCountMatch) {
      const labelMatch = getDictionaryEntry(leadingCountMatch[2].trim(), dictionary);
      if (labelMatch) {
        return {
          entry: labelMatch.entry,
          original: trimmed,
          prefix: leadingCountMatch[1] + ' ' + labelMatch.prefix,
          suffix: labelMatch.suffix,
        };
      }
    }
    const plusSuffixMatch = trimmed.match(/\s*(\+{1,2})$/);
    const baseText = plusSuffixMatch
      ? trimmed.slice(0, -plusSuffixMatch[0].length).trim()
      : trimmed;
    const suffix = plusSuffixMatch ? plusSuffixMatch[1] : '';
    const lookup = getNormalizedDictionaryLookup(dictionary);
    const matchedKey =
      lookup &&
      (lookup.get(normalizeLookupKey(trimmed)) ||
        lookup.get(normalizeLookupKey(baseText)));
    if (!matchedKey) {
      return null;
    }
    return {
      entry: dictionary[matchedKey],
      original: trimmed,
      prefix: '',
      suffix,
    };
  }

  function getSnapshotMap(dictionary) {
    if (!dictionary || typeof dictionary !== 'object') {
      return processedSnapshots;
    }
    let snapshotMap = processedSnapshots.get(dictionary);
    if (!snapshotMap) {
      snapshotMap = new WeakMap();
      processedSnapshots.set(dictionary, snapshotMap);
    }
    return snapshotMap;
  }

  function translateTextNode(textNode, dictionary, options = {}) {
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE || !dictionary) {
      return;
    }
    const snapshotMap = getSnapshotMap(dictionary);
    const currentValue = textNode.textContent || '';
    if (snapshotMap.get(textNode) === currentValue) {
      return;
    }
    const trimmed = currentValue.trim();
    if (!trimmed) {
      snapshotMap.set(textNode, currentValue);
      return;
    }
    const match = getDictionaryEntry(trimmed, dictionary);
    if (!match) {
      snapshotMap.set(textNode, currentValue);
      return;
    }
    const preferred = selectPreferredEntry(match.entry, options);
    if (!preferred) {
      snapshotMap.set(textNode, currentValue);
      return;
    }
    const nextText = formatWithOptionalOriginal(
      match.prefix + preferred + match.suffix,
      match.original,
      options
    );
    const leadingWhitespace = currentValue.match(/^\s*/)?.[0] || '';
    const trailingWhitespace = currentValue.match(/\s*$/)?.[0] || '';
    textNode.textContent = leadingWhitespace + nextText + trailingWhitespace;
    snapshotMap.set(textNode, textNode.textContent || '');
  }

  function translateElementAttributes(element, dictionary, options = {}) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE || !dictionary) {
      return;
    }
    TRANSLATABLE_ATTRIBUTE_NAMES.forEach((attrName) => {
      const currentValue = element.getAttribute(attrName);
      if (!currentValue) {
        return;
      }
      const match = getDictionaryEntry(currentValue, dictionary);
      if (!match) {
        return;
      }
      const preferred = selectPreferredEntry(match.entry, options);
      if (!preferred) {
        return;
      }
      element.setAttribute(attrName, match.prefix + preferred + match.suffix);
    });
  }

  function translateContainer(container, dictionaries, options = {}) {
    if (!container) {
      return;
    }
    const dictionariesList = (dictionaries || []).filter(Boolean);
    if (!dictionariesList.length) {
      return;
    }
    if (container.nodeType === Node.ELEMENT_NODE) {
      dictionariesList.forEach((dict) => {
        translateElementAttributes(container, dict, options);
      });
      if (typeof container.querySelectorAll === 'function') {
        container
          .querySelectorAll('input, textarea, button, a, [aria-label], [title], [placeholder]')
          .forEach((element) => {
            dictionariesList.forEach((dict) => {
              translateElementAttributes(element, dict, options);
            });
          });
      }
    }
    const ownerDocument = container.ownerDocument || document;
    const walker = ownerDocument.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (!options.shouldSkipTextNode || !options.shouldSkipTextNode(currentNode)) {
        dictionariesList.forEach((dict) => {
          translateTextNode(currentNode, dict, options);
        });
      }
      currentNode = walker.nextNode();
    }
  }

  function findContainers(root, selectors, options = {}) {
    const containers = new Set();
    const includeAncestors = options.includeAncestors !== false;
    getBaseNodes(root).forEach((node) => {
      if (!node) {
        return;
      }
      selectors.forEach((selector) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          typeof node.matches === 'function' &&
          node.matches(selector)
        ) {
          containers.add(node);
        }
        if (typeof node.querySelectorAll === 'function') {
          node.querySelectorAll(selector).forEach((element) => {
            containers.add(element);
          });
        }
        if (
          includeAncestors &&
          node.nodeType === Node.ELEMENT_NODE &&
          typeof node.closest === 'function'
        ) {
          const ancestor = node.closest(selector);
          if (ancestor) {
            containers.add(ancestor);
          }
        }
      });
    });
    return Array.from(containers);
  }

  window.wonderfutFutggTranslationUtils = {
    isFutggHost,
    getBaseNodes,
    translateContainer,
    findContainers,
  };
})();
