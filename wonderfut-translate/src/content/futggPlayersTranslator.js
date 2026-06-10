(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const PLAYERS_PAGE_REGEX = /^\/players(?:\/.*)?$/i;
  const PLAYER_CARD_LINK_SELECTOR = 'a[href^="/players/"][href*="-"]';
  const CONTAINER_SELECTORS = [
    'main h1',
    'main p',
    'main a[href]',
    'main button',
    'main [role="tablist"]',
    'main nav',
    'aside',
    '[class*="filter"]',
    '[class*="pagination"]',
    '[data-radix-scroll-area-viewport]',
    'main input',
  ];
  const DICTIONARY = {
    'FC 26 Players': { professional: 'FC 26 球员', playerSlang: 'FC 26 球员' },
    'FC 26 PLAYERS': { professional: 'FC 26 球员', playerSlang: 'FC 26 球员' },
    'EA SPORTS FC 26 Players': { professional: 'EA SPORTS FC 26 球员', playerSlang: 'EA SPORTS FC 26 球员' },
    'Try out our new player filtering system for EA SPORTS FC 26. Browse through all the EA FC 26 Players, ratings, and prices in EA SPORTS FC Ultimate Team. Find the best fit for your squad using our comprehensive filtering system.': {
      professional: '试用我们的 EA SPORTS FC 26 球员筛选系统。浏览 EA SPORTS FC Ultimate Team 中所有 EA FC 26 球员、评分和价格，并用完整筛选系统找到最适合你阵容的球员。',
      playerSlang: '试用我们的 EA SPORTS FC 26 球员筛选系统。浏览 EA SPORTS FC Ultimate Team 中所有 EA FC 26 球员、评分和价格，并用完整筛选系统找到最适合你阵容的球员。',
    },
    'Apply a filter to get started...': { professional: '应用一个筛选条件开始...', playerSlang: '应用一个筛选条件开始...' },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    'NEW PLAYERS': { professional: '新球员', playerSlang: '新球员' },
    'TRENDING PLAYERS': { professional: '热门球员', playerSlang: '热门球员' },
    'IN PACKS': { professional: '卡包中', playerSlang: '卡包中' },
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
    'Skill Moves': { professional: '花式', playerSlang: '花式' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    PlayStyles: { professional: '比赛风格', playerSlang: '比赛风格' },
    'Low Driven': { professional: '大力低射', playerSlang: '低射' },
    'Long Ball': { professional: '远距离传球', playerSlang: '长传' },
    'Has Any Selected PlayStyles': { professional: '拥有任意已选比赛风格', playerSlang: '拥有任意已选比赛风格' },
    'Min PlayStyles': { professional: '最少比赛风格', playerSlang: '最少比赛风格' },
    'Max PlayStyles': { professional: '最多比赛风格', playerSlang: '最多比赛风格' },
    'Min PlayStyles+': { professional: '最少比赛风格+', playerSlang: '最少比赛风格+' },
    'Max PlayStyles+': { professional: '最多比赛风格+', playerSlang: '最多比赛风格+' },
    Roles: { professional: '角色', playerSlang: '角色' },
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
    'Go Back': { professional: '返回', playerSlang: '返回' },
    'Clear All': { professional: '清除全部', playerSlang: '清除全部' },
    Search: { professional: '搜索', playerSlang: '搜索' },
    'Search...': { professional: '搜索...', playerSlang: '搜索...' },
    Previous: { professional: '上一页', playerSlang: '上一页' },
    Next: { professional: '下一页', playerSlang: '下一页' },
  };

  function isTargetPage(locationObj = window.location) {
    return Boolean(
      utils?.isFutggHost(locationObj) &&
        PLAYERS_PAGE_REGEX.test(locationObj.pathname || '')
    );
  }

  function shouldSkipTextNode(textNode) {
    return Boolean(
      textNode?.parentElement?.closest(PLAYER_CARD_LINK_SELECTOR)
    );
  }

  function translate(root, _dictionary, options = {}) {
    if (!isTargetPage()) {
      return;
    }
    const extraDictionaries = Array.isArray(options.extraDictionaries)
      ? options.extraDictionaries
      : [];
    const translationOptions = { ...options };
    delete translationOptions.extraDictionaries;
    const dictionaries = [DICTIONARY, ...extraDictionaries];
    const containers = utils.findContainers(root, CONTAINER_SELECTORS);
    containers.forEach((container) => {
      utils.translateContainer(container, dictionaries, {
        ...translationOptions,
        shouldSkipTextNode,
      });
    });
  }

  window.wonderfutFutggPlayersTranslator = {
    translate,
    isTargetPage,
  };
})();
