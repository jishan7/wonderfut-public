(() => {
  const FUTGG_EVOLUTION_LAB_REGEX = /^\/evo-lab\/evolve\/?/;
  const FUTGG_EVOLUTIONS_COLLECTION_REGEX = /^\/evolutions(?:\/[a-z-]+\/?)*\/?$/i;
  const FUTGG_PLAYER_EVOLUTIONS_REGEX =
    /^\/players\/\d+-[a-z0-9-]+\/evolutions(?:\/.*)?$/i;
  const FUTGG_HOSTNAME_KEYWORD = 'fut.gg';
  const EVOLUTION_CONTAINER_SELECTOR = '[data-js-selector="create-my-evolutions"]';
  const PLAYER_EVOLUTION_CARD_CLASS = 'fc-card-container';
  const EVOLUTION_LINK_SELECTOR = 'a[href*="/evolutions/"]';
  const EVOLUTION_LINK_PATH_REGEX = /^\/evolutions\/\d+-[a-z0-9-]+\/?$/i;
  const processedTextSnapshots = new WeakMap();
  const containerObservers = new WeakMap();

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

  function isFutggEvolutionsListingPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTGG_HOSTNAME_KEYWORD) &&
      FUTGG_EVOLUTIONS_COLLECTION_REGEX.test(pathname)
    );
  }

  function isFutggPlayerEvolutionsPage(locationObj = window.location) {
    if (!locationObj) {
      return false;
    }
    const { hostname = '', pathname = '' } = locationObj;
    return (
      hostname.includes(FUTGG_HOSTNAME_KEYWORD) &&
      FUTGG_PLAYER_EVOLUTIONS_REGEX.test(pathname)
    );
  }

  function isFutggEvolutionPage(locationObj = window.location) {
    return (
      isFutggEvolutionLabPage(locationObj) ||
      isFutggEvolutionsListingPage(locationObj) ||
      isFutggPlayerEvolutionsPage(locationObj)
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

  function translateTextNode(node, dictionary, options) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    const currentValue = node.textContent || '';
    if (processedTextSnapshots.get(node) === currentValue) {
      return;
    }
    const trimmed = currentValue.trim();
    if (!trimmed) {
      processedTextSnapshots.set(node, currentValue);
      return;
    }
    const entry = dictionary[trimmed];
    if (!entry) {
      processedTextSnapshots.set(node, currentValue);
      return;
    }
    const preferred = selectPreferredEntry(entry, options);
    if (!preferred) {
      processedTextSnapshots.set(node, currentValue);
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
    processedTextSnapshots.set(node, node.textContent || '');
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
      if (matchesSelector(node, EVOLUTION_CONTAINER_SELECTOR)) {
        containers.add(node);
      }
      if (typeof node.querySelectorAll === 'function') {
        node.querySelectorAll(EVOLUTION_CONTAINER_SELECTOR).forEach((el) => {
          containers.add(el);
        });
      }
      if (typeof node.closest === 'function') {
        const ancestor = node.closest(EVOLUTION_CONTAINER_SELECTOR);
        if (ancestor) {
          containers.add(ancestor);
        }
      }
    });

    return Array.from(containers);
  }

  function normalizeLinkPath(rawHref) {
    if (!rawHref) {
      return '';
    }
    try {
      const absoluteUrl = new URL(rawHref, window.location?.origin || 'https://www.fut.gg');
      return absoluteUrl.pathname || '';
    } catch (error) {
      if (rawHref.startsWith('/')) {
        return rawHref;
      }
      return '';
    }
  }

  function isEvolutionLinkElement(element) {
    if (!element || element.tagName !== 'A') {
      return false;
    }
    const hrefValue = element.getAttribute('href') || '';
    const normalizedPath = normalizeLinkPath(hrefValue);
    return Boolean(normalizedPath && EVOLUTION_LINK_PATH_REGEX.test(normalizedPath));
  }

  function findEvolutionLinkContainers(root) {
    const anchors = new Set();
    const baseNodes = getBaseNodes(root);

    baseNodes.forEach((node) => {
      if (!node) {
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE && isEvolutionLinkElement(node)) {
        anchors.add(node);
      }
      if (typeof node.querySelectorAll === 'function') {
        node.querySelectorAll(EVOLUTION_LINK_SELECTOR).forEach((anchor) => {
          if (isEvolutionLinkElement(anchor)) {
            anchors.add(anchor);
          }
        });
      }
    });

    return Array.from(anchors);
  }

  function elementHasClass(element, className) {
    return (
      element &&
      element.nodeType === Node.ELEMENT_NODE &&
      element.classList &&
      element.classList.contains(className)
    );
  }

  function registerPlayerCardScope(targetSet, container) {
    if (!targetSet || !container) {
      return;
    }
    targetSet.add(container);
    const parent = container.parentElement;
    if (parent && parent.nodeType === Node.ELEMENT_NODE) {
      targetSet.add(parent);
    }
  }

  function findPlayerEvolutionCardContainers(root) {
    const containers = new Set();
    const baseNodes = getBaseNodes(root);

    baseNodes.forEach((node) => {
      if (!node) {
        return;
      }
      if (elementHasClass(node, PLAYER_EVOLUTION_CARD_CLASS)) {
        registerPlayerCardScope(containers, node);
      }
      if (typeof node.querySelectorAll === 'function') {
        node
          .querySelectorAll('.' + PLAYER_EVOLUTION_CARD_CLASS)
          .forEach((el) => registerPlayerCardScope(containers, el));
      }
      if (
        typeof node.closest === 'function' &&
        node !== document &&
        node.nodeType === Node.ELEMENT_NODE
      ) {
        const ancestor = node.closest('.' + PLAYER_EVOLUTION_CARD_CLASS);
        if (ancestor) {
          registerPlayerCardScope(containers, ancestor);
        }
      }
    });

    return Array.from(containers);
  }

  function ensureContainerObserver(container, dictionary, options) {
    if (!container || containerObservers.has(container)) {
      return;
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          translateTextNode(mutation.target, dictionary, options);
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node, dictionary, options);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            translateWithinContainer(node, dictionary, options);
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

  function applyFutggEvolutionTranslations(root, dictionary, options = {}) {
    if (
      !dictionary ||
      !Object.keys(dictionary).length ||
      !isFutggEvolutionPage()
    ) {
      return;
    }
    const observedContainers = new Set();
    const passiveContainers = new Set();
    if (isFutggEvolutionLabPage()) {
      findLabContainers(root).forEach((container) => {
        if (container) {
          observedContainers.add(container);
        }
      });
    }
    if (isFutggEvolutionsListingPage()) {
      findEvolutionLinkContainers(root).forEach((container) => {
        if (container && !observedContainers.has(container)) {
          passiveContainers.add(container);
        }
      });
    }
    if (isFutggPlayerEvolutionsPage()) {
      findPlayerEvolutionCardContainers(root).forEach((container) => {
        if (container) {
          observedContainers.add(container);
        }
      });
    }
    if (!observedContainers.size && !passiveContainers.size) {
      return;
    }
    observedContainers.forEach((container) => {
      translateWithinContainer(container, dictionary, options);
      ensureContainerObserver(container, dictionary, options);
    });
    passiveContainers.forEach((container) => {
      translateWithinContainer(container, dictionary, options);
    });
  }

  window.wonderfutFutggEvolutionsTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutggEvolutionTranslations(root, dictionary, options);
    },
    isTargetPage: isFutggEvolutionPage,
  };
})();
