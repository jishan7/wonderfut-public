(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const TRENDING_EVOLUTIONS_PAGE_REGEX = /^\/evolutions\/trending\/?$/i;
  const CARD_LINK_SELECTOR = 'a[href^="/players/"][href*="-"]';
  const CONTAINER_SELECTORS = [
    'main h1',
    'main [role="tablist"]',
    'main input',
    'main button',
    'main aside',
    'main [class*="filter"]',
    'main [class*="description"]',
    'main [class*="toolbar"]',
  ];
  const DICTIONARY = {
    'EA SPORTS FC 26 Trending Evolutions Players': {
      professional: 'EA SPORTS FC 26 热门进化球员',
      playerSlang: 'EA SPORTS FC 26 热门进化球员',
    },
    'Browse through the trending Evolutions players on EA SPORTS FC 26 and find the best fit for your players to boost them to the next level.': {
      professional: '浏览 EA SPORTS FC 26 的热门进化球员，为你的球员找到最合适的升级路线。',
      playerSlang: '浏览 EA SPORTS FC 26 的热门进化球员，为你的球员找到最合适的升级路线。',
    },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    PLAYERS: { professional: '球员', playerSlang: '球员' },
    'TRENDING PLAYERS': { professional: '热门球员', playerSlang: '热门球员' },
    'EVO LAB': { professional: '进化实验室', playerSlang: '进化实验室' },
    'EXPIRED EVOLUTIONS': { professional: '已过期进化', playerSlang: '已过期进化' },
    'Apply a filter to get started...': {
      professional: '应用一个筛选条件开始...',
      playerSlang: '应用一个筛选条件开始...',
    },
    'Exclude Your Evolutions': {
      professional: '排除你的进化',
      playerSlang: '排除你的进化',
    },
    Close: { professional: '关闭', playerSlang: '关闭' },
    'Try out our Smart Search...': {
      professional: '试试智能搜索...',
      playerSlang: '试试智能搜索...',
    },
    Evolutions: { professional: '进化', playerSlang: '进化' },
    'Use Every Selected Evolution': {
      professional: '使用所有已选进化',
      playerSlang: '使用所有已选进化',
    },
    'Exclude Unselected Evolutions': {
      professional: '排除未选进化',
      playerSlang: '排除未选进化',
    },
    'Hide Evolution Combinations': {
      professional: '隐藏进化组合',
      playerSlang: '隐藏进化组合',
    },
    'Show Non-Upgraded Players': {
      professional: '显示未升级球员',
      playerSlang: '显示未升级球员',
    },
    'Show Multiple Versions of Same Player': {
      professional: '显示同一球员的多个版本',
      playerSlang: '显示同一球员的多个版本',
    },
    'Hide Paid Evolutions': {
      professional: '隐藏付费进化',
      playerSlang: '隐藏付费进化',
    },
    'Min Evolutions': { professional: '最少进化', playerSlang: '最少进化' },
    'Max Evolutions': { professional: '最多进化', playerSlang: '最多进化' },
    Clubs: { professional: '俱乐部', playerSlang: '俱乐部' },
    'Past and Present': { professional: '现役与历史', playerSlang: '现役与历史' },
    Nations: { professional: '国家/地区', playerSlang: '国家/地区' },
    Leagues: { professional: '联赛', playerSlang: '联赛' },
    Rarities: { professional: '稀有度', playerSlang: '稀有度' },
    'Custom Attributes': { professional: '自定义属性', playerSlang: '自定义属性' },
    'Age / OVR': { professional: '年龄 / 总评', playerSlang: '年龄 / 总评' },
    'Born After': { professional: '出生晚于', playerSlang: '出生晚于' },
    'Born Before': { professional: '出生早于', playerSlang: '出生早于' },
    'Select date': { professional: '选择日期', playerSlang: '选择日期' },
    'Min OVR': { professional: '最低总评', playerSlang: '最低总评' },
    'Max OVR': { professional: '最高总评', playerSlang: '最高总评' },
    Positions: { professional: '位置', playerSlang: '位置' },
    Attackers: { professional: '前锋', playerSlang: '前锋' },
    Midfielders: { professional: '中场', playerSlang: '中场' },
    Defenders: { professional: '后卫', playerSlang: '后卫' },
    'Only Primary Positions': { professional: '仅主要位置', playerSlang: '仅主要位置' },
  };

  function isTargetPage(locationObj = window.location) {
    return Boolean(
      utils?.isFutggHost(locationObj) &&
        TRENDING_EVOLUTIONS_PAGE_REGEX.test(locationObj.pathname || '')
    );
  }

  function shouldSkipTextNode(textNode) {
    return Boolean(textNode?.parentElement?.closest(CARD_LINK_SELECTOR));
  }

  function translate(root, _dictionary, options = {}) {
    if (!isTargetPage()) {
      return;
    }
    const containers = utils.findContainers(root, CONTAINER_SELECTORS);
    containers.forEach((container) => {
      utils.translateContainer(container, [DICTIONARY], {
        ...options,
        shouldSkipTextNode,
      });
    });
  }

  window.wonderfutFutggTrendingEvolutionsTranslator = {
    translate,
    isTargetPage,
  };
})();
