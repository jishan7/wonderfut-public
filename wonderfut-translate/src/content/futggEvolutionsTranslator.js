(() => {
  const FUTGG_EVOLUTION_LAB_REGEX = /^\/evo-lab(?:\/.*)?$/i;
  const FUTGG_EVOLUTIONS_COLLECTION_REGEX = /^\/evolutions(?:\/[a-z-]+\/?)*\/?$/i;
  const FUTGG_PLAYER_EVOLUTIONS_REGEX =
    /^\/players\/\d+-[a-z0-9-]+\/evolutions(?:\/.*)?$/i;
  const FUTGG_HOSTNAME_KEYWORD = 'fut.gg';
  const EVOLUTION_CONTAINER_SELECTORS = [
    '[data-js-selector="create-my-evolutions"]',
    '.scrollable-evo',
  ];
  const EVOLUTION_CARD_ROOT_SELECTOR =
    'div.rounded.border.border-gray.bg-gray-800.grid.h-full.relative';
  const PLAYER_EVOLUTION_CARD_CLASS = 'fc-card-container';
  const EVOLUTION_LINK_SELECTOR = 'a[href*="/evolutions/"]';
  const EVOLUTION_LINK_PATH_REGEX = /^\/evolutions\/\d+-[a-z0-9-]+\/?$/i;
  const TRANSLATABLE_ATTRIBUTE_NAMES = [
    'aria-label',
    'placeholder',
    'title',
    'value',
  ];
  const FUTGG_UI_DICTIONARY = {
    Players: { professional: '球员', playerSlang: '球员' },
    SBC: { professional: 'SBC', playerSlang: 'SBC' },
    'Squad Builder': { professional: '阵容建造器', playerSlang: '阵容建造器' },
    Evolutions: { professional: '进化', playerSlang: '进化' },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    Objectives: { professional: '任务', playerSlang: '任务' },
    'Evo Lab': { professional: '进化实验室', playerSlang: '进化实验室' },
    'GG Club': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    'GG CLUB': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    Login: { professional: '登录', playerSlang: '登录' },
    'Log In': { professional: '登录', playerSlang: '登录' },
    'Sign Up': { professional: '注册', playerSlang: '注册' },
    View: { professional: '查看', playerSlang: '查看' },
    'View →': { professional: '查看 →', playerSlang: '查看 →' },
    'View all': { professional: '查看全部', playerSlang: '查看全部' },
    'View all ↗': { professional: '查看全部 ↗', playerSlang: '查看全部 ↗' },
    Trending: { professional: '热门', playerSlang: '热门' },
    Recent: { professional: '最近', playerSlang: '最近' },
    Upgraded: { professional: '已升级', playerSlang: '已升级' },
    FEATURED: { professional: '精选', playerSlang: '精选' },
    'EXPIRING SOON': { professional: '即将结束', playerSlang: '即将结束' },
    'QUICK LINKS': { professional: '快捷入口', playerSlang: '快捷入口' },
    "What's New": { professional: '最新内容', playerSlang: '最新内容' },
    "What's Hot": { professional: '热门内容', playerSlang: '热门内容' },
    'The best PlayStyles for every role': { professional: '每个角色的最佳比赛风格', playerSlang: '每个角色的最佳比赛风格' },
    'See which PlayStyles to use for every role': { professional: '查看每个角色适合使用哪些比赛风格', playerSlang: '查看每个角色适合使用哪些比赛风格' },
    'EA SPORTS FC 26 Evolutions': { professional: 'EA SPORTS FC 26 进化', playerSlang: 'EA SPORTS FC 26 进化' },
    'Browse through the available Evolutions on EA FC 26 and find the best fit for your players to boost them to the next level.': {
      professional: '浏览 EA FC 26 当前可用的进化，为你的球员找到最合适的升级路线。',
      playerSlang: '浏览 EA FC 26 当前可用的进化，为你的球员找到最合适的升级路线。',
    },
    PLAYERS: { professional: '球员', playerSlang: '球员' },
    'TRENDING PLAYERS': { professional: '热门球员', playerSlang: '热门球员' },
    'EXPIRED EVOLUTIONS': { professional: '已过期进化', playerSlang: '已过期进化' },
    'Search evolutions...': { professional: '搜索进化...', playerSlang: '搜索进化...' },
    'Type "/" to search...': { professional: '输入 "/" 搜索...', playerSlang: '输入 "/" 搜索...' },
    'Search for a player...': { professional: '搜索球员...', playerSlang: '搜索球员...' },
    Rewards: { professional: '奖励', playerSlang: '奖励' },
    'PlayStyles Lab': { professional: '比赛风格实验室', playerSlang: '比赛风格实验室' },
    Roles: { professional: '角色', playerSlang: '角色' },
    'Roles++': { professional: '角色++', playerSlang: '角色++' },
    'Evo Lab Mode': { professional: '进化实验室模式', playerSlang: '进化实验室模式' },
    OFF: { professional: '关闭', playerSlang: '关闭' },
    ON: { professional: '开启', playerSlang: '开启' },
    'Expiring Soon': { professional: '即将结束', playerSlang: '即将结束' },
    REQUIREMENTS: { professional: '要求', playerSlang: '要求' },
    Requirements: { professional: '要求', playerSlang: '要求' },
    UPGRADES: { professional: '升级', playerSlang: '升级' },
    Upgrades: { professional: '升级', playerSlang: '升级' },
    'No upgrades': { professional: '无升级', playerSlang: '无升级' },
    'The best passers make every ball count. Evolve your player and sharpen the passing quality that unlocks any defence.': {
      professional: '最好的传球手让每一脚传球都有价值。进化你的球员，提升能够撕开任何防线的传球质量。',
      playerSlang: '最好的传球手让每一脚传球都有价值。进化你的球员，提升能够撕开任何防线的传球质量。',
    },
    'Show off your FC Champions Excellence! Give your favourite player a luxurious new look to showcase their elite status at your club.': {
      professional: '展示你的 FC Champions Excellence！给你最喜欢的球员换上华丽新外观，彰显他在俱乐部中的精英地位。',
      playerSlang: '展示你的 FC Champions Excellence！给你最喜欢的球员换上华丽新外观，彰显他在俱乐部中的精英地位。',
    },
    'The best attackers never stop moving forward. Evolve your player and channel the attacking quality that made Donovan one of the greatest.': {
      professional: '最好的进攻手永远向前。进化你的球员，释放让 Donovan 成为传奇之一的进攻质量。',
      playerSlang: '最好的进攻手永远向前。进化你的球员，释放让 Donovan 成为传奇之一的进攻质量。',
    },
    'Excluded Rarity': { professional: '排除稀有度', playerSlang: '排除稀有度' },
    Rarity: { professional: '稀有度', playerSlang: '稀有度' },
    Overall: { professional: '总评', playerSlang: '总评' },
    'Max PS': { professional: '最多比赛风格', playerSlang: '最多比赛风格' },
    'In Packs': { professional: '卡包中', playerSlang: '卡包中' },
    'Evo Leaderboards': { professional: '进化排行榜', playerSlang: '进化排行榜' },
    'Cheapest by Rating': { professional: '按评分最便宜', playerSlang: '按评分最便宜' },
    'Card Creator': { professional: '卡片生成器', playerSlang: '卡片生成器' },
    NEW: { professional: '新', playerSlang: '新' },
    FREE: { professional: '免费', playerSlang: '免费' },
    OVR: { professional: '总评', playerSlang: '总评' },
    PAC: { professional: '速度', playerSlang: '速度' },
    SHO: { professional: '射门', playerSlang: '射门' },
    PAS: { professional: '传球', playerSlang: '传球' },
    DRI: { professional: '盘带', playerSlang: '盘带' },
    DEF: { professional: '防守', playerSlang: '防守' },
    PHY: { professional: '身体', playerSlang: '身体' },
    WF: { professional: '逆足', playerSlang: '逆足' },
    SM: { professional: '花式', playerSlang: '花式' },
    Vision: { professional: '视野', playerSlang: '视野' },
    Crossing: { professional: '传中', playerSlang: '传中' },
    'FK Accuracy': { professional: '任意球精度', playerSlang: '任意球精度' },
    'Short Pass': { professional: '短传', playerSlang: '短传' },
    'Long Pass': { professional: '长传', playerSlang: '长传' },
    Curve: { professional: '弧线', playerSlang: '弧线' },
    'EA SPORTS FC 26 Players': { professional: 'EA SPORTS FC 26 球员', playerSlang: 'EA SPORTS FC 26 球员' },
    'EA SPORTS FC 26 Player Database': { professional: 'EA SPORTS FC 26 球员数据库', playerSlang: 'EA SPORTS FC 26 球员数据库' },
    'Explore the complete database of EA SPORTS FC 26 players, compare ratings, stats, prices, and more.': {
      professional: '浏览完整的 EA SPORTS FC 26 球员数据库，比较评分、数据、价格等信息。',
      playerSlang: '浏览完整的 EA SPORTS FC 26 球员数据库，比较评分、数据、价格等信息。',
    },
    'Search players...': { professional: '搜索球员...', playerSlang: '搜索球员...' },
    'Search Players...': { professional: '搜索球员...', playerSlang: '搜索球员...' },
    'Search for players...': { professional: '搜索球员...', playerSlang: '搜索球员...' },
    Filters: { professional: '筛选', playerSlang: '筛选' },
    FILTERS: { professional: '筛选', playerSlang: '筛选' },
    Clear: { professional: '清除', playerSlang: '清除' },
    'Clear Filters': { professional: '清除筛选', playerSlang: '清除筛选' },
    Apply: { professional: '应用', playerSlang: '应用' },
    Sort: { professional: '排序', playerSlang: '排序' },
    'Sort By': { professional: '排序方式', playerSlang: '排序方式' },
    Rating: { professional: '评分', playerSlang: '评分' },
    RAT: { professional: '评分', playerSlang: '评分' },
    Name: { professional: '姓名', playerSlang: '姓名' },
    NAME: { professional: '姓名', playerSlang: '姓名' },
    Position: { professional: '位置', playerSlang: '位置' },
    POSITION: { professional: '位置', playerSlang: '位置' },
    POS: { professional: '位置', playerSlang: '位置' },
    Version: { professional: '版本', playerSlang: '版本' },
    VERSION: { professional: '版本', playerSlang: '版本' },
    Price: { professional: '价格', playerSlang: '价格' },
    PRICE: { professional: '价格', playerSlang: '价格' },
    Nation: { professional: '国家/地区', playerSlang: '国家/地区' },
    NATION: { professional: '国家/地区', playerSlang: '国家/地区' },
    League: { professional: '联赛', playerSlang: '联赛' },
    LEAGUE: { professional: '联赛', playerSlang: '联赛' },
    Club: { professional: '俱乐部', playerSlang: '俱乐部' },
    CLUB: { professional: '俱乐部', playerSlang: '俱乐部' },
    Foot: { professional: '惯用脚', playerSlang: '惯用脚' },
    FOOT: { professional: '惯用脚', playerSlang: '惯用脚' },
    Height: { professional: '身高', playerSlang: '身高' },
    HEIGHT: { professional: '身高', playerSlang: '身高' },
    Age: { professional: '年龄', playerSlang: '年龄' },
    AGE: { professional: '年龄', playerSlang: '年龄' },
    'Skill Moves': { professional: '花式', playerSlang: '花式' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    Added: { professional: '新增', playerSlang: '新增' },
    Updated: { professional: '已更新', playerSlang: '已更新' },
    'FC 26 Players': { professional: 'FC 26 球员', playerSlang: 'FC 26 球员' },
    'FC 26 PLAYERS': { professional: 'FC 26 球员', playerSlang: 'FC 26 球员' },
    'Try out our new player filtering system for EA SPORTS FC 26. Browse through all the EA FC 26 Players, ratings, and prices in EA SPORTS FC Ultimate Team. Find the best fit for your squad using our comprehensive filtering system.': {
      professional: '试用我们的 EA SPORTS FC 26 球员筛选系统。浏览 EA SPORTS FC Ultimate Team 中所有 EA FC 26 球员、评分和价格，并用完整筛选系统找到最适合你阵容的球员。',
      playerSlang: '试用我们的 EA SPORTS FC 26 球员筛选系统。浏览 EA SPORTS FC Ultimate Team 中所有 EA FC 26 球员、评分和价格，并用完整筛选系统找到最适合你阵容的球员。',
    },
    'Apply a filter to get started...': { professional: '应用一个筛选条件开始...', playerSlang: '应用一个筛选条件开始...' },
    'NEW PLAYERS': { professional: '新球员', playerSlang: '新球员' },
    'WOMEN PLAYERS': { professional: '女足球员', playerSlang: '女足球员' },
    'MOMENTUM TRENDS': { professional: '动量趋势', playerSlang: '动量趋势' },
    'FC 25 PLAYERS': { professional: 'FC 25 球员', playerSlang: 'FC 25 球员' },
    'FC 24 PLAYERS': { professional: 'FC 24 球员', playerSlang: 'FC 24 球员' },
    'FIFA 23 PLAYERS': { professional: 'FIFA 23 球员', playerSlang: 'FIFA 23 球员' },
    'Try out our Smart Search...': { professional: '试试智能搜索...', playerSlang: '试试智能搜索...' },
    Quality: { professional: '质量', playerSlang: '质量' },
    Clubs: { professional: '俱乐部', playerSlang: '俱乐部' },
    'Past and Present': { professional: '现役与历史', playerSlang: '现役与历史' },
    Nations: { professional: '国家/地区', playerSlang: '国家/地区' },
    Leagues: { professional: '联赛', playerSlang: '联赛' },
    Rarities: { professional: '稀有度', playerSlang: '稀有度' },
    Squads: { professional: '阵容', playerSlang: '阵容' },
    'Custom Attributes': { professional: '自定义属性', playerSlang: '自定义属性' },
    'OVR / Price': { professional: '总评 / 价格', playerSlang: '总评 / 价格' },
    'Min OVR': { professional: '最低总评', playerSlang: '最低总评' },
    'Max OVR': { professional: '最高总评', playerSlang: '最高总评' },
    'Min Price': { professional: '最低价格', playerSlang: '最低价格' },
    'Max Price': { professional: '最高价格', playerSlang: '最高价格' },
    Positions: { professional: '位置', playerSlang: '位置' },
    Attackers: { professional: '前锋', playerSlang: '前锋' },
    Midfielders: { professional: '中场', playerSlang: '中场' },
    Defenders: { professional: '后卫', playerSlang: '后卫' },
    'Only Primary Positions': { professional: '仅主要位置', playerSlang: '仅主要位置' },
    'Has All Selected Positions': { professional: '拥有全部已选位置', playerSlang: '拥有全部已选位置' },
    'SM / WF': { professional: '花式 / 逆足', playerSlang: '花式 / 逆足' },
    PlayStyles: { professional: '比赛风格', playerSlang: '比赛风格' },
    'Has Any Selected PlayStyles': { professional: '拥有任意已选比赛风格', playerSlang: '拥有任意已选比赛风格' },
    'Min PlayStyles': { professional: '最少比赛风格', playerSlang: '最少比赛风格' },
    'Max PlayStyles': { professional: '最多比赛风格', playerSlang: '最多比赛风格' },
    'Min PlayStyles+': { professional: '最少比赛风格+', playerSlang: '最少比赛风格+' },
    'Max PlayStyles+': { professional: '最多比赛风格+', playerSlang: '最多比赛风格+' },
    'Min Roles+': { professional: '最少角色+', playerSlang: '最少角色+' },
    'Max Roles+': { professional: '最多角色+', playerSlang: '最多角色+' },
    'Min Roles++': { professional: '最少角色++', playerSlang: '最少角色++' },
    'Max Roles++': { professional: '最多角色++', playerSlang: '最多角色++' },
    Miscellaneous: { professional: '其他', playerSlang: '其他' },
    'Accelerate Type': { professional: '加速类型', playerSlang: '加速类型' },
    Explosive: { professional: '爆发', playerSlang: '爆发' },
    Lengthy: { professional: '漫长', playerSlang: '漫长' },
    Controlled: { professional: '控制', playerSlang: '控制' },
    'Strong Foot': { professional: '惯用脚', playerSlang: '惯用脚' },
    Left: { professional: '左脚', playerSlang: '左脚' },
    Right: { professional: '右脚', playerSlang: '右脚' },
    Gender: { professional: '性别', playerSlang: '性别' },
    Male: { professional: '男', playerSlang: '男' },
    Female: { professional: '女', playerSlang: '女' },
    'Body Type': { professional: '体型', playerSlang: '体型' },
    'Lean Short': { professional: '瘦削-矮', playerSlang: '瘦削-矮' },
    'Lean Medium': { professional: '瘦削-中等', playerSlang: '瘦削-中等' },
    'Lean Tall': { professional: '瘦削-高', playerSlang: '瘦削-高' },
    'Average Short': { professional: '普通-矮', playerSlang: '普通-矮' },
    'Average Medium': { professional: '普通-中等', playerSlang: '普通-中等' },
    'Average Tall': { professional: '普通-高', playerSlang: '普通-高' },
    'Stocky Short': { professional: '壮实-矮', playerSlang: '壮实-矮' },
    'Stocky Medium': { professional: '壮实-中等', playerSlang: '壮实-中等' },
    'Stocky Tall': { professional: '壮实-高', playerSlang: '壮实-高' },
    Unique: { professional: '独特', playerSlang: '独特' },
    'Min Height': { professional: '最低身高', playerSlang: '最低身高' },
    'Max Height': { professional: '最高身高', playerSlang: '最高身高' },
    'Min Weight': { professional: '最低体重', playerSlang: '最低体重' },
    'Max Weight': { professional: '最高体重', playerSlang: '最高体重' },
    'Min Age': { professional: '最低年龄', playerSlang: '最低年龄' },
    'Max Age': { professional: '最高年龄', playerSlang: '最高年龄' },
    'Born After': { professional: '出生晚于', playerSlang: '出生晚于' },
    'Born Before': { professional: '出生早于', playerSlang: '出生早于' },
    'Added After': { professional: '新增晚于', playerSlang: '新增晚于' },
    'Added Before': { professional: '新增早于', playerSlang: '新增早于' },
    'Select date': { professional: '选择日期', playerSlang: '选择日期' },
    'Show Only Market Players': { professional: '仅显示市场球员', playerSlang: '仅显示市场球员' },
    'Show Only Challenge Players': { professional: '仅显示挑战球员', playerSlang: '仅显示挑战球员' },
    'SBC Players Only': { professional: '仅 SBC 球员', playerSlang: '仅 SBC 球员' },
    'Objective Players Only': { professional: '仅任务球员', playerSlang: '仅任务球员' },
    'Season Pass Players Only': { professional: '仅季票球员', playerSlang: '仅季票球员' },
    'Active SBC Players Only': { professional: '仅当前 SBC 球员', playerSlang: '仅当前 SBC 球员' },
    'Active Objective Players Only': { professional: '仅当前任务球员', playerSlang: '仅当前任务球员' },
    'Active Season Pass Only': { professional: '仅当前季票', playerSlang: '仅当前季票' },
    'One Per Base Player': { professional: '每个基础球员只显示一个', playerSlang: '每个基础球员只显示一个' },
    'Has Dynamic': { professional: '有动态图片', playerSlang: '有动态图片' },
    'Has Real Face': { professional: '有真实脸型', playerSlang: '有真实脸型' },
    Previous: { professional: '上一页', playerSlang: '上一页' },
    Next: { professional: '下一页', playerSlang: '下一页' },
  };
  const processedTextSnapshots = new WeakMap();
  const dictionaryLookupCache = new WeakMap();
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

  function isFutggHost(locationObj = window.location) {
    return Boolean(
      locationObj && (locationObj.hostname || '').includes(FUTGG_HOSTNAME_KEYWORD)
    );
  }

  function isFutggEvolutionPage(locationObj = window.location) {
    return (
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

  function translateTextNode(node, dictionary, options) {
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    if (
      node.parentElement &&
      typeof node.parentElement.closest === 'function' &&
      node.parentElement.closest('a[href^="/players/"][href*="-"]')
    ) {
      return;
    }
    const currentValue = node.textContent || '';
    const trimmed = currentValue.trim();
    if (!trimmed) {
      processedTextSnapshots.set(node, currentValue);
      return;
    }
    const match = getDictionaryEntry(trimmed, dictionary);
    if (!match) {
      processedTextSnapshots.set(node, currentValue);
      return;
    }
    const preferred = selectPreferredEntry(match.entry, options);
    if (!preferred) {
      processedTextSnapshots.set(node, currentValue);
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
    processedTextSnapshots.set(node, node.textContent || '');
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
          const ancestor = node.closest(selector);
          if (ancestor) {
            containers.add(ancestor);
          }
        });
        if (
          node.matches &&
          node.matches('button[title="View evolution details"]')
        ) {
          const cardRoot = node.closest(EVOLUTION_CARD_ROOT_SELECTOR);
          if (cardRoot) {
            containers.add(cardRoot);
          }
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

  function translateWithDictionaries(container, dictionaries, options) {
    (dictionaries || []).forEach((dict) => {
      if (dict && Object.keys(dict).length) {
        translateWithinContainer(container, dict, options);
      }
    });
  }

  function ensureContainerObserver(container, dictionaries, options) {
    if (!container || containerObservers.has(container)) {
      return;
    }
    const dictionariesList = (dictionaries || []).filter(
      (dict) => dict && Object.keys(dict).length
    );
    if (!dictionariesList.length) {
      return;
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          dictionariesList.forEach((dict) => {
            translateTextNode(mutation.target, dict, options);
          });
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            dictionariesList.forEach((dict) => {
              translateTextNode(node, dict, options);
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            translateWithDictionaries(node, dictionariesList, options);
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
    if (!isFutggHost() || isFutggEvolutionLabPage()) {
      return;
    }
    const translationOptions = { ...options };
    const extraDictionariesOption = translationOptions.extraDictionaries;
    delete translationOptions.extraDictionaries;
    const dictionaries = [];
    if (dictionary && Object.keys(dictionary).length) {
      dictionaries.push(dictionary);
    }
    if (Array.isArray(extraDictionariesOption)) {
      extraDictionariesOption.forEach((dict) => {
        if (dict && Object.keys(dict).length) {
          dictionaries.push(dict);
        }
      });
    }
    dictionaries.push(FUTGG_UI_DICTIONARY);
    const observedContainers = new Set();
    const passiveContainers = new Set();
    getBaseNodes(root).forEach((node) => {
      if (!node || typeof node.querySelectorAll !== 'function') {
        return;
      }
      node.querySelectorAll('header, nav').forEach((container) => {
        observedContainers.add(container);
      });
    });
    if (isFutggEvolutionsListingPage()) {
      return;
    }
    if (isFutggPlayerEvolutionsPage()) {
      getBaseNodes(root).forEach((node) => {
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          observedContainers.add(node);
        } else if (node && node.body) {
          observedContainers.add(node.body);
        }
      });
      findEvolutionLinkContainers(root).forEach((container) => {
        if (container && !observedContainers.has(container)) {
          passiveContainers.add(container);
        }
      });
    }
    if (!observedContainers.size && !passiveContainers.size) {
      return;
    }
    observedContainers.forEach((container) => {
      translateWithDictionaries(container, dictionaries, translationOptions);
      ensureContainerObserver(container, dictionaries, translationOptions);
    });
    passiveContainers.forEach((container) => {
      translateWithDictionaries(container, dictionaries, translationOptions);
    });
  }

  window.wonderfutFutggEvolutionsTranslator = {
    translate(root, dictionary, options = {}) {
      applyFutggEvolutionTranslations(root, dictionary, options);
    },
    isTargetPage: isFutggEvolutionPage,
  };
})();
