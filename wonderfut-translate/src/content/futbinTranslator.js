(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const FUTBIN_HOST_KEYWORD = 'futbin.com';
  const HOMEPAGE_REGEX = /^\/?$/;
  const EVOLUTIONS_REGEX = /^\/evolutions\/?$/;
  const EVOLUTION_BUILDER_REGEX = /^\/(?:\d+\/)?evolutions\/builder\/[^/]+\/?$/;
  const POPULAR_EVOLUTIONS_REGEX = /^\/popular\/evolutions\/?$/;
  const PLAYER_DETAILS_REGEX = /^\/\d+\/player\/\d+(?:[_\d]*)?\/[^/]+\/?$/;
  const PLAYER_CARD_SELECTOR = [
    '.player-card',
    '.player-card-container',
    '.futbin-player-card',
    '.card-26',
    '.playercard',
  ].join(', ');
  const CONTAINER_SELECTORS = [
    'main',
    'header',
    'nav',
    'input',
    'button',
    'a',
    '[role="button"]',
  ];
  const UI_DICTIONARY = {
    Home: { professional: '首页', playerSlang: '首页' },
    Players: { professional: '球员', playerSlang: '球员' },
    'Squad Builder': { professional: '阵容建造器', playerSlang: '阵容建造器' },
    SBCs: { professional: 'SBC', playerSlang: 'SBC' },
    Squads: { professional: '阵容', playerSlang: '阵容' },
    Market: { professional: '市场', playerSlang: '市场' },
    Evolutions: { professional: '进化', playerSlang: '进化' },
    Community: { professional: '社区', playerSlang: '社区' },
    Summary: { professional: '概览', playerSlang: '概览' },
    Stats: { professional: '属性', playerSlang: '属性' },
    Evolution: { professional: '进化', playerSlang: '进化' },
    Comments: { professional: '评论', playerSlang: '评论' },
    'Log in': { professional: '登录', playerSlang: '登录' },
    'Search for Player...': { professional: '搜索球员...', playerSlang: '搜索球员...' },
    'Search for FC 26 Player...': { professional: '搜索 FC 26 球员...', playerSlang: '搜索 FC 26 球员...' },
    Popular: { professional: '热门', playerSlang: '热门' },
    'Latest Promo': { professional: '最新活动', playerSlang: '最新活动' },
    'New players': { professional: '新球员', playerSlang: '新球员' },
    'Latest SBCs': { professional: '最新SBC', playerSlang: '最新SBC' },
    'Cheapest by rating': { professional: '各评分最低价', playerSlang: '各评分最低价' },
    'All Popular Players': { professional: '所有热门球员', playerSlang: '所有热门球员' },
    'Popular Evolution Players': { professional: '热门进化球员', playerSlang: '热门进化球员' },
    'EA FC 26 Popular Evolution Players': { professional: 'EA FC 26 热门进化球员', playerSlang: 'EA FC 26 热门进化球员' },
    'Hottest UT 26 Evolutions': { professional: 'UT 26 最热门进化', playerSlang: 'UT 26 最热门进化' },
    'Select Evolution': { professional: '选择进化', playerSlang: '选择进化' },
    'EA FC 26 Evolutions': { professional: 'EA FC 26 进化', playerSlang: 'EA FC 26 进化' },
    'Explore all in-game evolution paths, including requirements, stats, and playstyles. Discover the best combinations and top-tier player picks.': {
      professional: '浏览游戏内所有进化路线，包括要求、属性和比赛风格。发现最佳组合和顶级球员选择。',
      playerSlang: '浏览游戏内所有进化路线，包括要求、属性和比赛风格。发现最佳组合和顶级球员选择。',
    },
    'My Evolutions': { professional: '我的进化', playerSlang: '我的进化' },
    'Saved Evolutions': { professional: '已保存进化', playerSlang: '已保存进化' },
    'Popular Players': { professional: '热门球员', playerSlang: '热门球员' },
    All: { professional: '全部', playerSlang: '全部' },
    'Expiring Soon': { professional: '即将结束', playerSlang: '即将结束' },
    Cosmetics: { professional: '卡面进化', playerSlang: '卡面进化' },
    'FoF: Pelé': { professional: '足球盛典：贝利', playerSlang: '足球盛典：贝利' },
    'PlayStyles Lab': { professional: '比赛风格实验室', playerSlang: '比赛风格实验室' },
    'PlayStyles+ Lab': { professional: '比赛风格+实验室', playerSlang: '比赛风格+实验室' },
    Rewards: { professional: '奖励', playerSlang: '奖励' },
    Roles: { professional: '角色', playerSlang: '角色' },
    'Training Camp': { professional: '训练营', playerSlang: '训练营' },
    'Search Evolutions...': { professional: '搜索进化...', playerSlang: '搜索进化...' },
    Active: { professional: '已启用', playerSlang: '已启用' },
    Expired: { professional: '已过期', playerSlang: '已过期' },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    'Player Requirements': { professional: '球员要求', playerSlang: '球员要求' },
    'Total Upgrades': { professional: '总升级', playerSlang: '总升级' },
    UNLOCK: { professional: '解锁', playerSlang: '解锁' },
    EXPIRES: { professional: '过期', playerSlang: '过期' },
    REPEATABLE: { professional: '可重复', playerSlang: '可重复' },
    TRAINING: { professional: '训练', playerSlang: '训练' },
    FREE: { professional: '免费', playerSlang: '免费' },
    Free: { professional: '免费', playerSlang: '免费' },
    WEEKS: { professional: '周', playerSlang: '周' },
    WEEK: { professional: '周', playerSlang: '周' },
    MONTHS: { professional: '个月', playerSlang: '个月' },
    MONTH: { professional: '个月', playerSlang: '个月' },
    HOUR: { professional: '小时', playerSlang: '小时' },
    Votes: { professional: '票', playerSlang: '票' },
    Overall: { professional: '总评', playerSlang: '总评' },
    PlayStyle: { professional: '比赛风格', playerSlang: '比赛风格' },
    'PlayStyle+': { professional: '比赛风格+', playerSlang: '比赛风格+' },
    'PS+': { professional: '比赛风格+', playerSlang: '比赛风格+' },
    'Not Rarity': { professional: '排除稀有度', playerSlang: '排除稀有度' },
    Rarity: { professional: '稀有度', playerSlang: '稀有度' },
    'Not Position': { professional: '排除位置', playerSlang: '排除位置' },
    Position: { professional: '位置', playerSlang: '位置' },
    Positions: { professional: '位置', playerSlang: '位置' },
    'Total Positions': { professional: '总位置数', playerSlang: '总位置数' },
    PS: { professional: '比赛风格', playerSlang: '比赛风格' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    Skills: { professional: '花式', playerSlang: '花式' },
    'Evolution Builder': { professional: '进化建造器', playerSlang: '进化建造器' },
    'Build your Evolution path': { professional: '构建你的进化路线', playerSlang: '构建你的进化路线' },
    'Evolution Builder': { professional: '进化建造器', playerSlang: '进化建造器' },
    Path: { professional: '路径', playerSlang: '路径' },
    Presets: { professional: '预设', playerSlang: '预设' },
    'possible upgrades': { professional: '个可能升级', playerSlang: '个可能升级' },
    'Base card': { professional: '基础卡', playerSlang: '基础卡' },
    'SHOW EXPIRED': { professional: '显示已过期', playerSlang: '显示已过期' },
    Categories: { professional: '分类', playerSlang: '分类' },
    Price: { professional: '价格', playerSlang: '价格' },
    'Sort by: Highest Upgrade': { professional: '排序：最高升级', playerSlang: '排序：最高升级' },
    'Exclude Evolutions': { professional: '排除进化', playerSlang: '排除进化' },
    upgrades: { professional: '个升级', playerSlang: '个升级' },
    'Player Details': { professional: '球员详情', playerSlang: '球员详情' },
    'Evolution Simulation': { professional: '进化模拟', playerSlang: '进化模拟' },
    'Prices and Rating': { professional: '价格和评分', playerSlang: '价格和评分' },
    'Price Updated': { professional: '价格更新时间', playerSlang: '价格更新时间' },
    'Price Range': { professional: '价格范围', playerSlang: '价格范围' },
    'SECS AGO': { professional: '秒前', playerSlang: '秒前' },
    'Price Updated:': { professional: '价格更新时间：', playerSlang: '价格更新时间：' },
    'Price Range:': { professional: '价格范围：', playerSlang: '价格范围：' },
    'B.TYPE': { professional: '体型', playerSlang: '体型' },
    '使用脚': { professional: '惯用脚', playerSlang: '惯用脚' },
    '身高': { professional: '身高', playerSlang: '身高' },
    '年龄': { professional: '年龄', playerSlang: '年龄' },
    '卡面': { professional: '卡面', playerSlang: '卡面' },
    '花式': { professional: '花式', playerSlang: '花式' },
    '逆足': { professional: '逆足', playerSlang: '逆足' },
    'The best passers make every ball count. Evolve your player and sharpen the passing quality that unlocks any defence.': {
      professional: '最好的传球手让每一次触球都产生价值。进化你的球员，提升能够撕开任何防线的传球质量。',
      playerSlang: '最好的传球手让每一次触球都产生价值。进化你的球员，提升能够撕开任何防线的传球质量。',
    },
  };

  function isFutbinHost(locationObj = window.location) {
    return Boolean((locationObj?.hostname || '').includes(FUTBIN_HOST_KEYWORD));
  }

  function isTargetPage(locationObj = window.location) {
    return isFutbinHost(locationObj);
  }

  function shouldTranslatePageBody(locationObj = window.location) {
    const pathname = locationObj?.pathname || '';
    return Boolean(
      isFutbinHost(locationObj) &&
        (HOMEPAGE_REGEX.test(pathname) ||
          EVOLUTIONS_REGEX.test(pathname) ||
          EVOLUTION_BUILDER_REGEX.test(pathname) ||
          POPULAR_EVOLUTIONS_REGEX.test(pathname) ||
          PLAYER_DETAILS_REGEX.test(pathname))
    );
  }

  function shouldSkipTextNode(textNode) {
    const parent = textNode?.parentElement;
    const text = (textNode?.textContent || '').trim();
    if (!parent) {
      return false;
    }
    const pathname = window.location.pathname || '';
    if (
      (HOMEPAGE_REGEX.test(pathname) || POPULAR_EVOLUTIONS_REGEX.test(pathname)) &&
      parent.matches('a[href*="/evolutions/builder/"], a[href*="/evolutions/"]') &&
      text
    ) {
      return false;
    }
    return Boolean(
      parent.closest(
        'script, style, svg, canvas, ' + PLAYER_CARD_SELECTOR
      )
    );
  }

  function getExtraDictionaries(options = {}) {
    return Array.isArray(options.extraDictionaries)
      ? options.extraDictionaries
      : [];
  }

  function getContainers(root) {
    if (!root || root === document || root.nodeType === Node.DOCUMENT_NODE) {
      const containers = new Set();
      const selectors = shouldTranslatePageBody()
        ? ['header', 'nav', 'main']
        : ['header', 'nav'];
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          containers.add(element);
        });
      });
      if (!containers.size && document.body) {
        containers.add(document.body);
      }
      return Array.from(containers);
    }
    if (root.nodeType !== Node.ELEMENT_NODE) {
      return root.parentElement ? [root.parentElement] : [];
    }
    if (!shouldTranslatePageBody() && !root.closest('header, nav')) {
      return [];
    }
    const containers = new Set([root]);
    CONTAINER_SELECTORS.forEach((selector) => {
      if (root.matches(selector)) {
        containers.add(root);
      }
      root.querySelectorAll(selector).forEach((element) => {
        containers.add(element);
      });
    });
    return Array.from(containers);
  }

  function translate(root, _dictionary, options = {}) {
    if (!isTargetPage()) {
      return;
    }
    const translationOptions = { ...options };
    delete translationOptions.extraDictionaries;
    const dictionaries = [UI_DICTIONARY, ...getExtraDictionaries(options)];
    const containers = getContainers(root);
    containers.forEach((container) => {
      utils.translateContainer(container, dictionaries, {
        ...translationOptions,
        shouldSkipTextNode,
      });
    });
  }

  window.wonderfutFutbinTranslator = {
    translate,
    isTargetPage,
  };
})();
