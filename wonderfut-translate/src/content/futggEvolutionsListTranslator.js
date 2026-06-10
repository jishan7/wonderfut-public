(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const EVOLUTIONS_PAGE_REGEX = /^\/evolutions\/?$/i;
  const EVO_LAB_EVOLUTIONS_PAGE_REGEX = /^\/evo-lab\/evolutions\/?$/i;
  const CONTAINER_SELECTORS = [
    'main',
    'main h1',
    'main p',
    'main a[href]',
    'main [role="tablist"]',
    'main input',
    'main button',
    'main [class*="filter"]',
    'main [class*="require"]',
    'main [class*="upgrade"]',
    'main article',
    'main section',
  ];
  const DICTIONARY = {
    'EA SPORTS FC 26 Evolutions': { professional: 'EA SPORTS FC 26 进化', playerSlang: 'EA SPORTS FC 26 进化' },
    'Browse through the available Evolutions on EA FC 26 and find the best fit for your players to boost them to the next level.': {
      professional: '浏览 EA FC 26 当前可用的进化，为你的球员找到最合适的升级路线。',
      playerSlang: '浏览 EA FC 26 当前可用的进化，为你的球员找到最合适的升级路线。',
    },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    Evolutions: { professional: '进化', playerSlang: '进化' },
    PLAYERS: { professional: '球员', playerSlang: '球员' },
    'TRENDING PLAYERS': { professional: '热门球员', playerSlang: '热门球员' },
    'EVO LAB': { professional: '进化实验室', playerSlang: '进化实验室' },
    'EXPIRED EVOLUTIONS': { professional: '已过期进化', playerSlang: '已过期进化' },
    'Search evolutions...': { professional: '搜索进化...', playerSlang: '搜索进化...' },
    'Search for an evolution...': { professional: '搜索进化...', playerSlang: '搜索进化...' },
    EXCLUDED: { professional: '已排除', playerSlang: '已排除' },
    Excluded: { professional: '已排除', playerSlang: '已排除' },
    ACTIVE: { professional: '可用', playerSlang: '可用' },
    Active: { professional: '可用', playerSlang: '可用' },
    ELIGIBLE: { professional: '符合条件', playerSlang: '符合条件' },
    Eligible: { professional: '符合条件', playerSlang: '符合条件' },
    USED: { professional: '已使用', playerSlang: '已使用' },
    Used: { professional: '已使用', playerSlang: '已使用' },
    Settings: { professional: '设置', playerSlang: '设置' },
    'YOUR ELIGIBLE PLAYERS': { professional: '符合条件的球员', playerSlang: '符合条件的球员' },
    'None of your players are eligible for this evolution. You can find other options here.': {
      professional: '你的球员中没有符合此进化条件的球员。你可以在这里查看其他选项。',
      playerSlang: '你的球员中没有符合此进化条件的球员。你可以在这里查看其他选项。',
    },
    'None of your players are eligible for this evolution. You can find other options': {
      professional: '你的球员中没有符合此进化条件的球员。你可以查看其他选项',
      playerSlang: '你的球员中没有符合此进化条件的球员。你可以查看其他选项',
    },
    here: { professional: '这里', playerSlang: '这里' },
    'EXCLUDE FROM PLAYER UPGRADES': { professional: '从球员升级中排除', playerSlang: '从球员升级中排除' },
    'Exclude from player upgrades': { professional: '从球员升级中排除', playerSlang: '从球员升级中排除' },
    Rewards: { professional: '奖励', playerSlang: '奖励' },
    'PlayStyles Lab': { professional: '比赛风格实验室', playerSlang: '比赛风格实验室' },
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
    'Excluded Rarity': { professional: '排除稀有度', playerSlang: '排除稀有度' },
    Rarity: { professional: '稀有度', playerSlang: '稀有度' },
    Overall: { professional: '总评', playerSlang: '总评' },
    'Max PS': { professional: '最多比赛风格', playerSlang: '最多比赛风格' },
    'Max PS+': { professional: '最多比赛风格+', playerSlang: '最多比赛风格+' },
    WF: { professional: '逆足', playerSlang: '逆足' },
    SM: { professional: '花式', playerSlang: '花式' },
    Vision: { professional: '视野', playerSlang: '视野' },
    Crossing: { professional: '传中', playerSlang: '传中' },
    'FK Accuracy': { professional: '任意球精度', playerSlang: '任意球精度' },
    'Short Pass': { professional: '短传', playerSlang: '短传' },
    'Long Pass': { professional: '长传', playerSlang: '长传' },
    Curve: { professional: '弧线', playerSlang: '弧线' },
    'The best passers make every ball count. Evolve your player and sharpen the passing quality that unlocks any defence.': {
      professional: '最好的传球手让每一次触球都产生价值。进化你的球员，提升能够撕开任何防线的传球质量。',
      playerSlang: '最好的传球手让每一次触球都产生价值。进化你的球员，提升能够撕开任何防线的传球质量。',
    },
    'Show off your FC Champions Excellence! Give your favourite player a luxurious new look to showcase their elite status at your club.': {
      professional: '展示你的 FC Champions Excellence！给你最喜欢的球员换上豪华新外观，彰显他在俱乐部中的精英地位。',
      playerSlang: '展示你的 FC Champions Excellence！给你最喜欢的球员换上豪华新外观，彰显他在俱乐部中的精英地位。',
    },
  };

  function isTargetPage(locationObj = window.location) {
    return Boolean(
      utils?.isFutggHost(locationObj) &&
        (EVOLUTIONS_PAGE_REGEX.test(locationObj.pathname || '') ||
          EVO_LAB_EVOLUTIONS_PAGE_REGEX.test(locationObj.pathname || ''))
    );
  }

  function shouldSkipTextNode(textNode) {
    return Boolean(
      textNode?.parentElement?.closest('img, picture, svg, a[href^="/players/"]')
    );
  }

  function translate(root, evolutionsDictionary, options = {}) {
    if (!isTargetPage()) {
      return;
    }
    const extraDictionaries = Array.isArray(options.extraDictionaries)
      ? options.extraDictionaries
      : [];
    const translationOptions = { ...options };
    delete translationOptions.extraDictionaries;
    const dictionaries = [evolutionsDictionary, DICTIONARY, ...extraDictionaries];
    const containers = utils.findContainers(root, CONTAINER_SELECTORS);
    containers.forEach((container) => {
      utils.translateContainer(container, dictionaries, {
        ...translationOptions,
        shouldSkipTextNode,
      });
    });
  }

  window.wonderfutFutggEvolutionsListTranslator = {
    translate,
    isTargetPage,
  };
})();
