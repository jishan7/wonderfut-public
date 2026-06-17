(() => {
  const FUTGG_EVOLUTION_LAB_REGEX = /^\/evo-lab(?:\/.*)?$/i;
  const FUTGG_HOSTNAME_KEYWORD = 'fut.gg';
  const EVOLUTION_CONTAINER_SELECTORS = [
    'main',
    '[role="main"]',
    '[data-js-selector="create-my-evolutions"]',
    '.scrollable-evo',
    '[role="dialog"]',
    '[data-radix-portal]',
    '[data-radix-popper-content-wrapper]',
    'aside',
    '[class*="dialog"]',
    '[class*="modal"]',
    '[class*="popover"]',
    '[class*="sheet"]',
    '[class*="drawer"]',
    '[data-state="open"]',
    'input[placeholder]',
    'textarea[placeholder]',
  ];
  const EVOLUTION_CARD_ROOT_SELECTOR =
    'div.rounded.border.border-gray.bg-gray-800.grid.h-full.relative';
  const EVO_LAB_UI_DICTIONARY = {
    PLAYERS: { professional: '球员', playerSlang: '球员' },
    Players: { professional: '球员', playerSlang: '球员' },
    UPGRADES: { professional: '升级', playerSlang: '升级' },
    Upgrades: { professional: '升级', playerSlang: '升级' },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    Evolutions: { professional: '进化详情', playerSlang: '进化详情' },
    EVOLVE: { professional: '进化', playerSlang: '进化' },
    Evolve: { professional: '开始进化', playerSlang: '开始进化' },
    'GG CLUB': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    'GG Club': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    'GG CLUBS': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    'ALL EVOS': { professional: '全部进化', playerSlang: '全部进化' },
    ALL: { professional: '全部', playerSlang: '全部' },
    All: { professional: '全部', playerSlang: '全部' },
    NEW: { professional: '新', playerSlang: '新' },
    New: { professional: '新', playerSlang: '新' },
    SYNC: { professional: '同步', playerSlang: '同步' },
    Sync: { professional: '同步', playerSlang: '同步' },
    ACTIVE: { professional: '已启用', playerSlang: '已启用' },
    CUSTOMISE: { professional: '自定义', playerSlang: '自定义' },
    CUSTOMIZE: { professional: '自定义', playerSlang: '自定义' },
    REVIEW: { professional: '预览', playerSlang: '预览' },
    Settings: { professional: '设置', playerSlang: '设置' },
    'SORT BY': { professional: '排序方式', playerSlang: '排序方式' },
    'Sort By': { professional: '排序方式', playerSlang: '排序方式' },
    'Newest First': { professional: '最新优先', playerSlang: '最新优先' },
    'Oldest First': { professional: '最旧优先', playerSlang: '最旧优先' },
    'Price: Low to High': { professional: '价格从低到高', playerSlang: '价格从低到高' },
    'Price: High to Low': { professional: '价格从高到低', playerSlang: '价格从高到低' },
    'GGR Increase': { professional: 'GGR 增幅', playerSlang: 'GGR 增幅' },
    'Expiring Soonest': { professional: '最快到期', playerSlang: '最快到期' },
    FILTERS: { professional: '筛选', playerSlang: '筛选' },
    Filters: { professional: '筛选', playerSlang: '筛选' },
    'Check Eligibility': { professional: '检查可用性', playerSlang: '检查可用性' },
    'Hide Expired': { professional: '隐藏过期', playerSlang: '隐藏过期' },
    'Show upgrades': { professional: '显示升级', playerSlang: '显示升级' },
    'Show Upgrades': { professional: '显示升级', playerSlang: '显示升级' },
    'Show cards': { professional: '显示卡片', playerSlang: '显示卡片' },
    'Show Cards': { professional: '显示卡片', playerSlang: '显示卡片' },
    'WATCH PLAYER': { professional: '查看球员', playerSlang: '查看球员' },
    'Watch Player': { professional: '查看球员', playerSlang: '查看球员' },
    'Has Upgrade + GGR': {
      professional: '有升级 + GGR',
      playerSlang: '有升级 + GGR',
    },
    GGR: { professional: 'GGR', playerSlang: 'GGR' },
    POSITIONS: { professional: '位置', playerSlang: '位置' },
    ATTACKERS: { professional: '前锋', playerSlang: '前锋' },
    MIDFIELDERS: { professional: '中场', playerSlang: '中场' },
    DEFENDERS: { professional: '后卫', playerSlang: '后卫' },
    'SHOW / HIDE': { professional: '显示 / 隐藏', playerSlang: '显示 / 隐藏' },
    'Hide Base Players': {
      professional: '隐藏基础球员',
      playerSlang: '隐藏基础球员',
    },
    'Hide Evolutions Players': {
      professional: '隐藏进化球员',
      playerSlang: '隐藏进化球员',
    },
    'Hide Reward Upgrades': {
      professional: '隐藏奖励升级',
      playerSlang: '隐藏奖励升级',
    },
    '+ CREATE': { professional: '+ 创建', playerSlang: '+ 创建' },
    CREATE: { professional: '创建', playerSlang: '创建' },
    Create: { professional: '创建', playerSlang: '创建' },
    Filter: { professional: '筛选', playerSlang: '筛选' },
    'Search your players...': {
      professional: '搜索你的球员...',
      playerSlang: '搜索你的球员...',
    },
    'Search players...': {
      professional: '搜索球员...',
      playerSlang: '搜索球员...',
    },
    'Search your evolutions...': {
      professional: '搜索你的进化...',
      playerSlang: '搜索你的进化...',
    },
    'Sync to Evo Lab': {
      professional: '同步到进化实验室',
      playerSlang: '同步到进化实验室',
    },
    'GG Club tracks your players’ final stats, but not the evolution path that created them. Players you already have in Evo Lab keep their evolution path and have their stats matched to your club; new players sync as custom players without a path.': {
      professional: 'GG 俱乐部会记录你球员的最终属性，但不会记录生成这些属性的进化路径。已在进化实验室中的球员会保留进化路径，并把属性匹配到你的俱乐部；新球员会以没有路径的自定义球员同步。',
      playerSlang: 'GG 俱乐部会记录你球员的最终属性，但不会记录生成这些属性的进化路径。已在进化实验室中的球员会保留进化路径，并把属性匹配到你的俱乐部；新球员会以没有路径的自定义球员同步。',
    },
    "GG Club tracks your players' final stats, but not the evolution path that created them. Players you already have in Evo Lab keep their evolution path and have their stats matched to your club; new players sync as custom players without a path.": {
      professional: 'GG 俱乐部会记录你球员的最终属性，但不会记录生成这些属性的进化路径。已在进化实验室中的球员会保留进化路径，并把属性匹配到你的俱乐部；新球员会以没有路径的自定义球员同步。',
      playerSlang: 'GG 俱乐部会记录你球员的最终属性，但不会记录生成这些属性的进化路径。已在进化实验室中的球员会保留进化路径，并把属性匹配到你的俱乐部；新球员会以没有路径的自定义球员同步。',
    },
    APPLY: { professional: '应用', playerSlang: '应用' },
    RESET: { professional: '重置', playerSlang: '重置' },
    OVERALL: { professional: '总评', playerSlang: '总评' },
    Overall: { professional: '总评', playerSlang: '总评' },
    Ovorall: { professional: '总评', playerSlang: '总评' },
    'Reset Modification': { professional: '重置自定义', playerSlang: '重置自定义' },
    'Reset Modifications': { professional: '重置自定义', playerSlang: '重置自定义' },
    'GENERAL INFORMATION': { professional: '通用信息', playerSlang: '通用信息' },
    'General Information': { professional: '通用信息', playerSlang: '通用信息' },
    RARITY: { professional: '稀有度', playerSlang: '稀有度' },
    Rarity: { professional: '稀有度', playerSlang: '稀有度' },
    'COSMETIC EVOLUTION': { professional: '卡面进化', playerSlang: '卡面进化' },
    'Cosmetic Evolution': { professional: '卡面进化', playerSlang: '卡面进化' },
    'Select a Cosmetic Evolution': { professional: '选择卡面进化', playerSlang: '选择卡面进化' },
    POSITION: { professional: '位置', playerSlang: '位置' },
    Position: { professional: '位置', playerSlang: '位置' },
    'ALTERNATIVE POSITIONS': { professional: '其他位置', playerSlang: '其他位置' },
    'Alternative Positions': { professional: '其他位置', playerSlang: '其他位置' },
    'Tap once to add a PlayStyle, tap again to upgrade to PlayStyle+, tap a third time to remove.': {
      professional: '点击一次添加比赛风格，再点击一次升级为比赛风格+，第三次点击移除。',
      playerSlang: '点击一次添加比赛风格，再点击一次升级为比赛风格+，第三次点击移除。',
    },
    'Tap once to add a PlayStyle, tap again to upgrade to 比赛风格+, tap a third time to remove.': {
      professional: '点击一次添加比赛风格，再点击一次升级为比赛风格+，第三次点击移除。',
      playerSlang: '点击一次添加比赛风格，再点击一次升级为比赛风格+，第三次点击移除。',
    },
    FREE: { professional: '免费', playerSlang: '免费' },
    'APPLIED EVOLUTIONS': { professional: '已应用的进化', playerSlang: '已应用的进化' },
    'No evolutions applied': { professional: '未应用进化', playerSlang: '未应用进化' },
    'Select a player to evolve': { professional: '选择要进化的球员', playerSlang: '选择要进化的球员' },
    'Search evolutions...': { professional: '搜索进化...', playerSlang: '搜索进化...' },
    'Search for an evolution...': { professional: '搜索进化...', playerSlang: '搜索进化...' },
    PLAYSTYLES: { professional: '比赛风格', playerSlang: '比赛风格' },
    'PLAYSTYLE+': { professional: '比赛风格+', playerSlang: '比赛风格+' },
    PLAYSTYLE: { professional: '比赛风格', playerSlang: '比赛风格' },
    ROLES: { professional: '角色', playerSlang: '角色' },
    'View evolution details': { professional: '查看进化详情', playerSlang: '查看进化详情' },
    OVR: { professional: '总评', playerSlang: '总评' },
    PAC: { professional: '速度', playerSlang: '速度' },
    SHO: { professional: '射门', playerSlang: '射门' },
    PAS: { professional: '传球', playerSlang: '传球' },
    DRI: { professional: '盘带', playerSlang: '盘带' },
    DEF: { professional: '防守', playerSlang: '防守' },
    PHY: { professional: '身体', playerSlang: '身体' },
    'Att. Pos.': { professional: '进攻位置', playerSlang: '进攻位置' },
    WF: { professional: '逆足', playerSlang: '逆足' },
    SM: { professional: '花式', playerSlang: '花式' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    'Skill Move': { professional: '花式', playerSlang: '花式' },
    'Skill Moves': { professional: '花式', playerSlang: '花式' },
    'Def. Aware.': { professional: '防守意识', playerSlang: '防守意识' },
    'Def. Aware': { professional: '防守意识', playerSlang: '防守意识' },
    'Defensive Awareness': { professional: '防守意识', playerSlang: '防守意识' },
    'Quick Step': { professional: '健步如飞', playerSlang: '火箭' },
    Quickstep: { professional: '健步如飞', playerSlang: '火箭' },
    'Low Driven': { professional: '大力低射', playerSlang: '低射' },
    'Low Driv': { professional: '大力低射', playerSlang: '低射' },
    Gamechanger: { professional: '颠覆者', playerSlang: '外脚背射门' },
  };
  const TRANSLATABLE_ATTRIBUTE_NAMES = [
    'aria-label',
    'placeholder',
    'title',
    'value',
  ];
  const defaultProcessedTextSnapshots = new WeakMap();
  const dictionarySnapshotsCache = new WeakMap();
  const dictionaryLookupCache = new WeakMap();
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

  function normalizeComparableKey(value) {
    return normalizeLookupKey(value).toLowerCase();
  }

  function getNormalizedDictionaryLookup(dictionary) {
    if (!dictionary || typeof dictionary !== 'object') {
      return null;
    }
    let lookup = dictionaryLookupCache.get(dictionary);
    if (!lookup) {
      lookup = new Map();
      Object.keys(dictionary).forEach((key) => {
        const normalizedKey = normalizeComparableKey(key);
        if (normalizedKey && !lookup.has(normalizedKey)) {
          lookup.set(normalizedKey, key);
        }
      });
      dictionaryLookupCache.set(dictionary, lookup);
    }
    return lookup;
  }

  function getDictionaryEntry(rawText, dictionary) {
    if (!dictionary || !rawText) {
      return null;
    }
    const trimmed = String(rawText).trim();
    if (!trimmed) {
      return null;
    }
    let entry = dictionary[trimmed];
    if (entry) {
      return { entry, original: trimmed, prefix: '', suffix: '' };
    }
    const upperKey = trimmed.toUpperCase();
    if (upperKey !== trimmed) {
      entry = dictionary[upperKey];
      if (entry) {
        return { entry, original: trimmed, prefix: '', suffix: '' };
      }
    }
    const statChangeMatch = trimmed.match(/^([+-]?\d+)\s+([A-Za-z. ]+)$/);
    if (statChangeMatch) {
      const prefix = statChangeMatch[1] + ' ';
      const statText = statChangeMatch[2].trim();
      const statMatch = getDictionaryEntry(statText, dictionary);
      if (statMatch) {
        return {
          entry: statMatch.entry,
          original: trimmed,
          prefix,
          suffix: statMatch.suffix,
        };
      }
    }
    const trailingCountMatch = trimmed.match(/^([A-Za-z][A-Za-z. /+&-]+?)\s+(\d+)$/);
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
    const plusSuffixMatch = trimmed.match(/\s*(\+{1,2})$/);
    const baseText = plusSuffixMatch
      ? trimmed.slice(0, -plusSuffixMatch[0].length).trim()
      : trimmed;
    const suffix = plusSuffixMatch ? plusSuffixMatch[1] : '';
    const normalizedTrimmed = normalizeComparableKey(trimmed);
    const normalizedBase = normalizeComparableKey(baseText);
    const lookup = getNormalizedDictionaryLookup(dictionary);
    const matchedKey =
      lookup && (lookup.get(normalizedTrimmed) || lookup.get(normalizedBase));
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
    const match = getDictionaryEntry(trimmed, dictionary);
    if (!match) {
      snapshotMap.set(node, currentValue);
      return;
    }
    const preferred = selectPreferredEntry(match.entry, options);
    if (!preferred) {
      snapshotMap.set(node, currentValue);
      return;
    }
    const translated = formatWithOptionalOriginal(
      match.prefix + preferred + match.suffix,
      match.original,
      options
    );
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

  function translateElementAttributes(element, dictionary, options) {
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

  function translateWithinContainer(container, dictionary, options) {
    if (!container) {
      return;
    }
    if (container.nodeType === Node.ELEMENT_NODE) {
      translateElementAttributes(container, dictionary, options);
      if (typeof container.querySelectorAll === 'function') {
        const attributeSelector = isLargePageContainer(container)
          ? 'input, textarea, button, a, [aria-label], [title], [placeholder]'
          : '*';
        container.querySelectorAll(attributeSelector).forEach((element) => {
          translateElementAttributes(element, dictionary, options);
        });
      }
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
          if (selector === 'main' || selector === '[role="main"]') {
            return;
          }
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

  function isLargePageContainer(container) {
    if (!container || container === document.body || container === document.documentElement) {
      return true;
    }
    if (container.tagName === 'MAIN') {
      return true;
    }
    if (
      container.getAttribute &&
      container.getAttribute('role') === 'main'
    ) {
      return true;
    }
    return false;
  }

  function ensureContainerObserver(
    container,
    dictionaries,
    options,
    accelerateReplacements
  ) {
    if (!container || isLargePageContainer(container) || containerObservers.has(container)) {
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
    const primaryDictionary =
      dictionary && Object.keys(dictionary).length ? dictionary : null;
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
    supplementalDictionaries.push(EVO_LAB_UI_DICTIONARY);
    if (!isFutggEvolutionLabPage()) {
      return;
    }
    const containers = findLabContainers(root);
    if (!containers.length) {
      getBaseNodes(root).forEach((node) => {
        if (node && node.nodeType === Node.DOCUMENT_NODE && document.body) {
          containers.push(document.body);
        } else if (node && node.nodeType === Node.ELEMENT_NODE) {
          containers.push(node);
        }
      });
    }

    containers.forEach((container) => {
      if (primaryDictionary) {
        translateWithinContainer(container, primaryDictionary, translationOptions);
      }
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
        [primaryDictionary, ...supplementalDictionaries],
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
