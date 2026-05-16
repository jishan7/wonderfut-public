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

  function isFutbinHost(locationObj = window.location) {
    return Boolean(locationObj && locationObj.hostname.includes('futbin.com'));
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

  function normalizeRoleKey(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function translateRoleBadge(el, dictionary, options) {
    if (
      !el ||
      el.dataset.roleTranslated === '1' ||
      el.dataset.wonderfutRoleTranslated === '1'
    ) {
      return;
    }
    const rawText = (el.textContent || '').trim();
    if (!rawText) {
      return;
    }
    const baseText = rawText.replace(/\s*\+\+*$/, '').trim();
    if (!baseText) {
      return;
    }
    const normalizedKey = normalizeRoleKey(baseText);
    const entry = dictionary[normalizedKey] || dictionary[baseText];
    if (!entry) {
      return;
    }
    const preferred = options.usePlayerSlang
      ? entry.playerSlang || entry.professional
      : entry.professional || entry.playerSlang;
    if (!preferred) {
      return;
    }

    const suffixMatch = rawText.match(/\+\+*$/);
    const suffix = suffixMatch ? suffixMatch[0] : '';

    if (options.showOriginalWithBrackets) {
      el.textContent = `${preferred}${suffix} (${baseText})`;
    } else {
      el.textContent = `${preferred}${suffix}`;
    }

    el.dataset.roleTranslated = '1';
    el.dataset.wonderfutRoleTranslated = '1';
  }

  function getDirectTextContent(element) {
    if (!element) {
      return '';
    }
    const textNodes = Array.from(element.childNodes).filter(
      (node) => node.nodeType === Node.TEXT_NODE
    );
    return textNodes.map((node) => node.textContent || '').join(' ');
  }

  function findEditableTextNode(element) {
    const nodes = Array.from(element.childNodes);
    return nodes.find((node) => {
      return node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0;
    });
  }

  function translateRoleLinks(el, dictionary, options) {
    if (!el || el.dataset.wonderfutRoleTranslated === '1') {
      return;
    }
    const directText = getDirectTextContent(el).trim();
    const rawText = directText || (el.textContent || '').trim();
    if (!rawText) {
      return;
    }
    const baseText = normalizeRoleKey(rawText.replace(/\s*\+\++$/, ''));
    const entry = dictionary[baseText];
    if (!entry) {
      return;
    }
    const preferred = options.usePlayerSlang
      ? entry.playerSlang || entry.professional
      : entry.professional || entry.playerSlang;
    if (!preferred) {
      return;
    }
    const targetText = formatWithOptionalOriginal(preferred, baseText, options);

    const textNode = findEditableTextNode(el);
    if (textNode) {
      const leadingWhitespace = textNode.textContent.match(/^\s*/)?.[0] || '';
      const trailingWhitespace = textNode.textContent.match(/\s*$/)?.[0] || '';
      textNode.textContent = `${leadingWhitespace}${targetText}${trailingWhitespace}`;
    } else {
      el.insertBefore(document.createTextNode(targetText), el.firstChild);
    }

    el.dataset.wonderfutRoleTranslated = '1';
  }

  function applyFutbinRoleTranslations(root, dictionary, options) {
    if (!dictionary || !Object.keys(dictionary).length) {
      return;
    }
    if (!isFutbinHost()) {
      return;
    }
    const targetRoot = root || document;

    const badgeNodes = targetRoot.querySelectorAll(
      'span.positive-color[data-futbin-rating-box-role]'
    );
    badgeNodes.forEach((el) => translateRoleBadge(el, dictionary, options));

    if (!isFutbinPlayerDetailsPage()) {
      return;
    }
    const roleLinks = targetRoot.querySelectorAll(
      'a[href*="/roles"].positive-color'
    );
    roleLinks.forEach((el) => translateRoleLinks(el, dictionary, options));
  }

  window.wonderfutRoleTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutbinRoleTranslations(root, dictionary, options);
    },
  };
})();
