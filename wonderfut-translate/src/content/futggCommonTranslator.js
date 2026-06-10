(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const NAV_DICTIONARY = {
    Players: { professional: '球员', playerSlang: '球员' },
    SBC: { professional: 'SBC', playerSlang: 'SBC' },
    'Squad Builder': { professional: '阵容建造器', playerSlang: '阵容建造器' },
    Evolutions: { professional: '进化', playerSlang: '进化' },
    Objectives: { professional: '任务', playerSlang: '任务' },
    'Evo Lab': { professional: '进化实验室', playerSlang: '进化实验室' },
    'GG Club': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    'GG CLUB': { professional: 'GG 俱乐部', playerSlang: 'GG 俱乐部' },
    Login: { professional: '登录', playerSlang: '登录' },
    'Log In': { professional: '登录', playerSlang: '登录' },
    'Sign Up': { professional: '注册', playerSlang: '注册' },
    'Type "/" to search...': {
      professional: '输入 "/" 搜索...',
      playerSlang: '输入 "/" 搜索...',
    },
    'Search for a player...': {
      professional: '搜索球员...',
      playerSlang: '搜索球员...',
    },
    'The best PlayStyles for every role': {
      professional: '每个位置最好的比赛风格',
      playerSlang: '每个位置最好的比赛风格',
    },
    'See which PlayStyles to use for every role': {
      professional: '查看每个位置适合使用的比赛风格',
      playerSlang: '查看每个位置适合使用的比赛风格',
    },
    View: { professional: '查看', playerSlang: '查看' },
    'View →': { professional: '查看 →', playerSlang: '查看 →' },
    'View all': { professional: '查看全部', playerSlang: '查看全部' },
    'View all ↗': { professional: '查看全部 ↗', playerSlang: '查看全部 ↗' },
    Trending: { professional: '热门', playerSlang: '热门' },
    Evos: { professional: '进化', playerSlang: '进化' },
    Recent: { professional: '最近', playerSlang: '最近' },
    Upgraded: { professional: '已升级', playerSlang: '已升级' },
  };

  function getContainers(root) {
    if (!root || root === document || root.nodeType === Node.DOCUMENT_NODE) {
      return document.body ? [document.body] : [];
    }
    if (root.nodeType === Node.ELEMENT_NODE) {
      return [root];
    }
    if (root.parentElement) {
      return [root.parentElement];
    }
    return [];
  }

  function translate(root, _dictionary, options = {}) {
    if (!utils?.isFutggHost()) {
      return;
    }
    getContainers(root).forEach((container) => {
      utils.translateContainer(container, [NAV_DICTIONARY], options);
    });
  }

  window.wonderfutFutggCommonTranslator = {
    translate,
    isTargetPage() {
      return utils?.isFutggHost();
    },
  };
})();
