(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const POPUP_SELECTORS = [
    '[role="dialog"]',
    '[role="tooltip"]',
    '[data-radix-portal]',
    '[data-radix-popper-content-wrapper]',
    '[class*="dialog"]',
    '[class*="modal"]',
    '[class*="popover"]',
    '[class*="drawer"]',
    '[class*="sheet"]',
    '[class*="overlay"]',
  ];
  const POPUP_HINTS = [
    'Player Information',
    'Attributes',
    'Face Stats',
    'AcceleRATE',
    'Chemistry',
  ];
  const CARD_LINK_SELECTOR = 'a[href^="/players/"][href*="-"]';
  const processedSnapshots = new WeakMap();

  const UI_DICTIONARY = {
    Attributes: { professional: '属性', playerSlang: '属性' },
    'Face Stats': { professional: '面板数据', playerSlang: '面板数据' },
    'Player Information': {
      professional: '球员信息',
      playerSlang: '球员信息',
    },
    Name: { professional: '姓名', playerSlang: '姓名' },
    Club: { professional: '俱乐部', playerSlang: '俱乐部' },
    League: { professional: '联赛', playerSlang: '联赛' },
    Nation: { professional: '国家/地区', playerSlang: '国家/地区' },
    Height: { professional: '身高', playerSlang: '身高' },
    Weight: { professional: '体重', playerSlang: '体重' },
    Foot: { professional: '惯用脚', playerSlang: '惯用脚' },
    Left: { professional: '左脚', playerSlang: '左脚' },
    Right: { professional: '右脚', playerSlang: '右脚' },
    Skills: { professional: '花式', playerSlang: '花式' },
    'Skill Moves': { professional: '花式', playerSlang: '花式' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    AcceleRATE: { professional: '加速类型', playerSlang: '加速类型' },
    Lengthy: { professional: '漫长', playerSlang: '漫长' },
    Controlled: { professional: '控制', playerSlang: '控制' },
    Explosive: { professional: '爆发', playerSlang: '爆发' },
    Bodytype: { professional: '体型', playerSlang: '体型' },
    'Body Type': { professional: '体型', playerSlang: '体型' },
    Age: { professional: '年龄', playerSlang: '年龄' },
    'Average Tall': { professional: '普通-高', playerSlang: '普通-高' },
    'Average Medium': { professional: '普通-中等', playerSlang: '普通-中等' },
    'Average Short': { professional: '普通-矮', playerSlang: '普通-矮' },
    'Lean Tall': { professional: '瘦削-高', playerSlang: '瘦削-高' },
    'Lean Medium': { professional: '瘦削-中等', playerSlang: '瘦削-中等' },
    'Lean Short': { professional: '瘦削-矮', playerSlang: '瘦削-矮' },
    'Stocky Tall': { professional: '壮实-高', playerSlang: '壮实-高' },
    'Stocky Medium': { professional: '壮实-中等', playerSlang: '壮实-中等' },
    'Stocky Short': { professional: '壮实-矮', playerSlang: '壮实-矮' },
    PAC: { professional: '速度', playerSlang: '速度' },
    SHO: { professional: '射门', playerSlang: '射门' },
    PAS: { professional: '传球', playerSlang: '传球' },
    DRI: { professional: '盘带', playerSlang: '盘带' },
    DEF: { professional: '防守', playerSlang: '防守' },
    PHY: { professional: '身体', playerSlang: '身体' },
    Acceleration: { professional: '加速', playerSlang: '加速' },
    'Sprint Speed': { professional: '冲刺速度', playerSlang: '冲刺速度' },
    Positioning: { professional: '进攻位置', playerSlang: '进攻位置' },
    Finishing: { professional: '终结', playerSlang: '终结' },
    'Shot Power': { professional: '射门力量', playerSlang: '射门力量' },
    'Long Shots': { professional: '远射', playerSlang: '远射' },
    Volleys: { professional: '凌空', playerSlang: '凌空' },
    Penalties: { professional: '点球', playerSlang: '点球' },
    Vision: { professional: '视野', playerSlang: '视野' },
    Crossing: { professional: '传中', playerSlang: '传中' },
    'FK Accuracy': { professional: '任意球精度', playerSlang: '任意球精度' },
    'Short Pass': { professional: '短传', playerSlang: '短传' },
    'Long Pass': { professional: '长传', playerSlang: '长传' },
    Curve: { professional: '弧线', playerSlang: '弧线' },
    Agility: { professional: '敏捷性', playerSlang: '敏捷性' },
    Balance: { professional: '平衡', playerSlang: '平衡' },
    Reactions: { professional: '反应', playerSlang: '反应' },
    'Ball Control': { professional: '控球', playerSlang: '控球' },
    Dribbling: { professional: '盘带', playerSlang: '盘带' },
    Composure: { professional: '沉着', playerSlang: '沉着' },
    Interceptions: { professional: '拦截', playerSlang: '拦截' },
    Heading: { professional: '头球精度', playerSlang: '头球精度' },
    'Def Awareness': { professional: '防守意识', playerSlang: '防守意识' },
    'Def. Aware.': { professional: '防守意识', playerSlang: '防守意识' },
    'Standing Tackle': { professional: '抢断', playerSlang: '抢断' },
    'Sliding Tackle': { professional: '滑铲', playerSlang: '滑铲' },
    Jumping: { professional: '弹跳', playerSlang: '弹跳' },
    Stamina: { professional: '耐力', playerSlang: '耐力' },
    Strength: { professional: '力量', playerSlang: '力量' },
    Aggression: { professional: '侵略性', playerSlang: '侵略性' },
    IGS: { professional: '游戏内总属性', playerSlang: '游戏内总属性' },
  };

  const dictionaryAliasCache = new WeakMap();

  function isTargetPage(locationObj = window.location) {
    return Boolean(utils?.isFutggHost(locationObj));
  }

  function selectPreferredEntry(entry, options = {}) {
    if (!entry) {
      return '';
    }
    const professional = entry.professional || entry.playerSlang || '';
    const playerSlang = entry.playerSlang || entry.professional || '';
    return options.usePlayerSlang ? playerSlang : professional;
  }

  function buildAliasDictionary(dictionary) {
    if (!dictionary || typeof dictionary !== 'object') {
      return null;
    }
    let cached = dictionaryAliasCache.get(dictionary);
    if (cached) {
      return cached;
    }
    cached = { ...dictionary };
    Object.keys(dictionary).forEach((key) => {
      const spacedKey = key.replace(/-/g, ' ');
      if (spacedKey !== key && !cached[spacedKey]) {
        cached[spacedKey] = dictionary[key];
      }
    });
    dictionaryAliasCache.set(dictionary, cached);
    return cached;
  }

  function shouldSkipTextNode(textNode) {
    return Boolean(
      textNode?.parentElement?.closest(
        'script, style, svg, img, picture, canvas, video, ' +
          CARD_LINK_SELECTOR
      )
    );
  }

  function hasPopupHint(element) {
    const text = element?.textContent || '';
    return POPUP_HINTS.some((hint) => text.includes(hint));
  }

  function findPopupContainers(root) {
    const containers = new Set();
    const baseNodes = utils?.getBaseNodes ? utils.getBaseNodes(root) : [root || document];

    baseNodes.forEach((node) => {
      if (!node) {
        return;
      }
      POPUP_SELECTORS.forEach((selector) => {
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          typeof node.matches === 'function' &&
          node.matches(selector) &&
          hasPopupHint(node)
        ) {
          containers.add(node);
        }
        if (typeof node.querySelectorAll === 'function') {
          node.querySelectorAll(selector).forEach((element) => {
            if (hasPopupHint(element)) {
              containers.add(element);
            }
          });
        }
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          typeof node.closest === 'function'
        ) {
          const ancestor = node.closest(selector);
          if (ancestor && hasPopupHint(ancestor)) {
            containers.add(ancestor);
          }
        }
      });
      if (node.nodeType === Node.ELEMENT_NODE && hasPopupHint(node)) {
        containers.add(node);
      }
      if (typeof node.querySelectorAll === 'function') {
        node.querySelectorAll('div, section, article, aside').forEach((element) => {
          if (hasPopupHint(element)) {
            containers.add(element);
          }
        });
      }
    });

    return Array.from(containers).filter((container, index, list) => {
      return !list.some((other, otherIndex) => {
        return (
          otherIndex !== index &&
          other &&
          container &&
          other !== document.body &&
          typeof other.contains === 'function' &&
          other.contains(container)
        );
      });
    });
  }

  function translateMixedTextNode(textNode, dictionaries, options = {}) {
    if (
      !textNode ||
      textNode.nodeType !== Node.TEXT_NODE ||
      shouldSkipTextNode(textNode)
    ) {
      return;
    }
    const currentValue = textNode.textContent || '';
    if (processedSnapshots.get(textNode) === currentValue) {
      return;
    }
    const trimmed = currentValue.trim();
    if (!trimmed) {
      processedSnapshots.set(textNode, currentValue);
      return;
    }
    let translated = trimmed;
    dictionaries.forEach((dictionary) => {
      if (!dictionary) {
        return;
      }
      Object.entries(dictionary).forEach(([english, entry]) => {
        const preferred = selectPreferredEntry(entry, options);
        if (!english || !preferred || translated.includes(preferred)) {
          return;
        }
        const escaped = english.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
        translated = translated.replace(
          new RegExp('(^|[^A-Za-z])(' + escaped + ')(?=$|[^A-Za-z])', 'g'),
          '$1' + preferred
        );
      });
    });
    if (translated !== trimmed) {
      const leadingWhitespace = currentValue.match(/^\s*/)?.[0] || '';
      const trailingWhitespace = currentValue.match(/\s*$/)?.[0] || '';
      textNode.textContent = leadingWhitespace + translated + trailingWhitespace;
    }
    processedSnapshots.set(textNode, textNode.textContent || '');
  }

  function translatePopupContainer(container, dictionaries, options = {}) {
    utils.translateContainer(container, dictionaries, {
      ...options,
      shouldSkipTextNode,
    });
    const ownerDocument = container.ownerDocument || document;
    const walker = ownerDocument.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      translateMixedTextNode(currentNode, dictionaries, options);
      currentNode = walker.nextNode();
    }
  }

  function translate(root, _dictionary, options = {}) {
    if (!isTargetPage()) {
      return;
    }
    const extraDictionaries = Array.isArray(options.extraDictionaries)
      ? options.extraDictionaries
      : [];
    const dictionaries = [
      UI_DICTIONARY,
      ...extraDictionaries.map(buildAliasDictionary),
    ].filter(Boolean);
    findPopupContainers(root).forEach((container) => {
      translatePopupContainer(container, dictionaries, options);
    });
  }

  window.wonderfutFutggPlayerPopoverTranslator = {
    translate,
    isTargetPage,
  };
})();
