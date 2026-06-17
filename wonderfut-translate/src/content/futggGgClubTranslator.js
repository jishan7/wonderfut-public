(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const GG_CLUB_PAGE_REGEX = /^\/gg-club(?:\/.*)?$/i;
  const CONTAINER_SELECTORS = [
    'body',
    'main',
    '[role="main"]',
    'aside',
    'nav',
    'header',
    'section',
    'form',
    'button',
    'a[href]',
    'input',
    '[role="tablist"]',
    '[class*="sidebar"]',
    '[class*="dialog"]',
    '[class*="popover"]',
    '[data-radix-scroll-area-viewport]',
  ];
  const PLAYER_LINK_SELECTOR = 'a[href^="/players/"][href*="-"]';
  const processedDynamicTextSnapshots = new WeakMap();
  const observedContainers = new WeakMap();

  const GG_CLUB_DICTIONARY = {
    'Welcome to GG Club': {
      professional: '欢迎来到 GG 俱乐部',
      playerSlang: '欢迎来到 GG 俱乐部',
    },
    'Link your EA account with FUT.GG to automatically sync all your squads. Immediately sync all your Evolutions, Players, Tactics, and Player Stats to FUT.GG and make your experience all the more seamless.': {
      professional: '将你的 EA 账号与 FUT.GG 关联，自动同步你的所有阵容。立即把进化、球员、战术和球员数据同步到 FUT.GG，让使用体验更顺畅。',
      playerSlang: '将你的 EA 账号与 FUT.GG 关联，自动同步你的所有阵容。立即把进化、球员、战术和球员数据同步到 FUT.GG，让使用体验更顺畅。',
    },
    'Enter your EA ID': {
      professional: '输入你的 EA ID',
      playerSlang: '输入你的 EA ID',
    },
    'Simply enter your EA ID and choose your platform.': {
      professional: '输入你的 EA ID，并选择游戏平台。',
      playerSlang: '输入你的 EA ID，并选择游戏平台。',
    },
    'Verify your Account': {
      professional: '验证你的账号',
      playerSlang: '验证你的账号',
    },
    'Verify Your Account': {
      professional: '验证你的账号',
      playerSlang: '验证你的账号',
    },
    'Change your Active Squad\'s name to the 4 letter code that we give you.': {
      professional: '把你的当前阵容名称改成我们给你的 4 位代码。',
      playerSlang: '把你的当前阵容名称改成我们给你的 4 位代码。',
    },
    'Change your Active Squad’s name to the 4 letter code that we give you.': {
      professional: '把你的当前阵容名称改成我们给你的 4 位代码。',
      playerSlang: '把你的当前阵容名称改成我们给你的 4 位代码。',
    },
    'Change your Active Squad\'s name to the 4 letter code below. You only need to do this once to verify. After that, you are free to change your squad name back to your desired name.': {
      professional: '把你的当前阵容名称改成下面的 4 位代码。只需要这样验证一次，之后你可以把阵容名称改回想要的名字。',
      playerSlang: '把你的当前阵容名称改成下面的 4 位代码。只需要这样验证一次，之后你可以把阵容名称改回想要的名字。',
    },
    'Change your Active Squad’s name to the 4 letter code below. You only need to do this once to verify. After that, you are free to change your squad name back to your desired name.': {
      professional: '把你的当前阵容名称改成下面的 4 位代码。只需要这样验证一次，之后你可以把阵容名称改回想要的名字。',
      playerSlang: '把你的当前阵容名称改成下面的 4 位代码。只需要这样验证一次，之后你可以把阵容名称改回想要的名字。',
    },
    'Where do I find this?': {
      professional: '在哪里能找到？',
      playerSlang: '在哪里能找到？',
    },
    'How do I do this?': {
      professional: '如何操作？',
      playerSlang: '如何操作？',
    },
    'Login to get started': {
      professional: '登录后开始',
      playerSlang: '登录后开始',
    },
    'Login to Get Started': {
      professional: '登录后开始',
      playerSlang: '登录后开始',
    },
    COPY: { professional: '复制', playerSlang: '复制' },
    Copy: { professional: '复制', playerSlang: '复制' },
    'I\'ve Changed My Active Squad Name': {
      professional: '我已修改当前阵容名称',
      playerSlang: '我已修改当前阵容名称',
    },
    'I’ve Changed My Active Squad Name': {
      professional: '我已修改当前阵容名称',
      playerSlang: '我已修改当前阵容名称',
    },
    'Start Over': { professional: '重新开始', playerSlang: '重新开始' },
    'Verifying...': { professional: '正在验证...', playerSlang: '正在验证...' },
    'We are checking your active squad name. This may take a few minutes depending on FUT.GG traffic.': {
      professional: '我们正在检查你的当前阵容名称。根据 FUT.GG 访问情况，这可能需要几分钟。',
      playerSlang: '我们正在检查你的当前阵容名称。根据 FUT.GG 访问情况，这可能需要几分钟。',
    },
    Home: { professional: '首页', playerSlang: '首页' },
    Players: { professional: '球员', playerSlang: '球员' },
    Evolutions: { professional: '进化', playerSlang: '进化' },
    Squads: { professional: '阵容', playerSlang: '阵容' },
    Tactics: { professional: '战术', playerSlang: '战术' },
    Statistics: { professional: '数据统计', playerSlang: '数据统计' },
    Settings: { professional: '设置', playerSlang: '设置' },
    'Squad Improvements': {
      professional: '阵容提升',
      playerSlang: '阵容提升',
    },
    NEW: { professional: '新', playerSlang: '新' },
    'NEW EVO': { professional: '新进化', playerSlang: '新进化' },
    SOON: { professional: '即将推出', playerSlang: '即将推出' },
    'Sync Active Squad': {
      professional: '同步当前阵容',
      playerSlang: '同步当前阵容',
    },
    Captain: { professional: '队长', playerSlang: '队长' },
    'Best Player': { professional: '最佳球员', playerSlang: '最佳球员' },
    'Longest Serving': {
      professional: '效力最久',
      playerSlang: '效力最久',
    },
    'Best EVO': { professional: '最佳进化', playerSlang: '最佳进化' },
    'Biggest Purchase': {
      professional: '最大手笔引援',
      playerSlang: '最大手笔引援',
    },
    Share: { professional: '分享', playerSlang: '分享' },
    'Download Share Asset': {
      professional: '下载分享图片',
      playerSlang: '下载分享图片',
    },
    'View Squad': { professional: '查看阵容', playerSlang: '查看阵容' },
    'View All': { professional: '查看全部', playerSlang: '查看全部' },
    'View All ↗': {
      professional: '查看全部 ↗',
      playerSlang: '查看全部 ↗',
    },
    'Games Played': { professional: '出场次数', playerSlang: '出场次数' },
    Goals: { professional: '进球', playerSlang: '进球' },
    Assists: { professional: '助攻', playerSlang: '助攻' },
    'G/A per Game': {
      professional: '场均进球+助攻',
      playerSlang: '场均进球+助攻',
    },
    Prices: { professional: '价格', playerSlang: '价格' },
    Collections: { professional: '收藏', playerSlang: '收藏' },
    'Evo Home': { professional: '进化首页', playerSlang: '进化首页' },
    'All Upgrades': { professional: '全部升级', playerSlang: '全部升级' },
    'Base Player Upgrades': {
      professional: '基础球员升级',
      playerSlang: '基础球员升级',
    },
    'Active Evolutions': {
      professional: '进行中的进化',
      playerSlang: '进行中的进化',
    },
    'Quick Upgrades': { professional: '快速升级', playerSlang: '快速升级' },
    'Your Drafts': { professional: '你的草稿', playerSlang: '你的草稿' },
    'Back to Club': {
      professional: '返回俱乐部',
      playerSlang: '返回俱乐部',
    },
    Drafts: { professional: '草稿', playerSlang: '草稿' },
    'Excluded Evolution': {
      professional: '排除的进化',
      playerSlang: '排除的进化',
    },
    'Excluded Evolution Evo': {
      professional: '排除的进化',
      playerSlang: '排除的进化',
    },
    'Excluded Evolutions': {
      professional: '排除的进化',
      playerSlang: '排除的进化',
    },
    Evo: { professional: '进化', playerSlang: '进化' },
    'Eligible for Any Evolution': {
      professional: '符合任意进化条件',
      playerSlang: '符合任意进化条件',
    },
    'Select a default view': {
      professional: '选择默认视图',
      playerSlang: '选择默认视图',
    },
    'Show players that are eligible for both stats and reward/objective evolutions.': {
      professional: '显示同时符合属性进化和奖励/任务进化条件的球员。',
      playerSlang: '显示同时符合属性进化和奖励/任务进化条件的球员。',
    },
    'Only Stats Evolutions': {
      professional: '仅属性进化',
      playerSlang: '仅属性进化',
    },
    'Show players that are eligible for only stats evolutions.': {
      professional: '只显示符合属性进化条件的球员。',
      playerSlang: '只显示符合属性进化条件的球员。',
    },
    'Only Reward Evolutions': {
      professional: '仅奖励进化',
      playerSlang: '仅奖励进化',
    },
    'Show players that are eligible for only reward/objective evolutions.': {
      professional: '只显示符合奖励/任务进化条件的球员。',
      playerSlang: '只显示符合奖励/任务进化条件的球员。',
    },
    'All Players': { professional: '全部球员', playerSlang: '全部球员' },
    'Ignore eligibility and show all players.': {
      professional: '忽略进化条件，显示全部球员。',
      playerSlang: '忽略进化条件，显示全部球员。',
    },
    'Your Eligible Players': {
      professional: '你符合条件的球员',
      playerSlang: '你符合条件的球员',
    },
    'Base Player Evos': {
      professional: '基础球员进化',
      playerSlang: '基础球员进化',
    },
    'You have no eligible players for this evolution.': {
      professional: '你没有符合此进化条件的球员。',
      playerSlang: '你没有符合此进化条件的球员。',
    },
    'You have no drafts. Evolve and save some evolutions to get started.': {
      professional: '你还没有草稿。先进行进化并保存一些方案即可开始。',
      playerSlang: '你还没有草稿。先进行进化并保存一些方案即可开始。',
    },
    Evolve: { professional: '进化', playerSlang: '进化' },
    Compare: { professional: '对比', playerSlang: '对比' },
    Preview: { professional: '预览', playerSlang: '预览' },
    Generate: { professional: '生成', playerSlang: '生成' },
    Generated: { professional: '已生成', playerSlang: '已生成' },
    Build: { professional: '构建', playerSlang: '构建' },
    Quick: { professional: '快速', playerSlang: '快速' },
    Balanced: { professional: '均衡', playerSlang: '均衡' },
    Complete: { professional: '完整', playerSlang: '完整' },
    'Fastest results, least thorough. Great if you just want something right away, but it may miss better options.': {
      professional: '结果最快，但不够全面。适合只想马上得到方案的情况，但可能错过更好的选择。',
      playerSlang: '结果最快，但不够全面。适合只想马上得到方案的情况，但可能错过更好的选择。',
    },
    'Best balance of speed and results. Often finds the same best paths as Complete, but it\'s not always guaranteed.': {
      professional: '速度和结果最均衡。通常能找到与完整模式相同的最佳路线，但不保证每次都一样。',
      playerSlang: '速度和结果最均衡。通常能找到与完整模式相同的最佳路线，但不保证每次都一样。',
    },
    'Best balance of speed and results. Often finds the same best paths as Complete, but it’s not always guaranteed.': {
      professional: '速度和结果最均衡。通常能找到与完整模式相同的最佳路线，但不保证每次都一样。',
      playerSlang: '速度和结果最均衡。通常能找到与完整模式相同的最佳路线，但不保证每次都一样。',
    },
    'Every possible path, slowest speed. Guarantees the best results by generating all options.': {
      professional: '遍历所有可能路线，速度最慢。通过生成全部选项来保证最佳结果。',
      playerSlang: '遍历所有可能路线，速度最慢。通过生成全部选项来保证最佳结果。',
    },
    'Custom Settings': {
      professional: '自定义设置',
      playerSlang: '自定义设置',
    },
    'Same Evos, Different Order': {
      professional: '相同进化，不同顺序',
      playerSlang: '相同进化，不同顺序',
    },
    'Tell us what to do if a player can evolve in two or more different ways (Evo A → Evo B or Evo B → Evo A).': {
      professional: '当球员可以用两种或更多不同顺序进化时，选择如何处理（进化 A → 进化 B，或进化 B → 进化 A）。',
      playerSlang: '当球员可以用两种或更多不同顺序进化时，选择如何处理（进化 A → 进化 B，或进化 B → 进化 A）。',
    },
    'Max Evolutions in Path': {
      professional: '路径最多进化数',
      playerSlang: '路径最多进化数',
    },
    'Choose the maximum number of Evolutions in a path. Higher numbers will take longer to generate.': {
      professional: '选择一条路径中最多包含的进化数量。数字越高，生成所需时间越长。',
      playerSlang: '选择一条路径中最多包含的进化数量。数字越高，生成所需时间越长。',
    },
    'Include Reward Evolutions': {
      professional: '包含奖励进化',
      playerSlang: '包含奖励进化',
    },
    'Include Season Pass, OBJs, and SBC EVOs.': {
      professional: '包含赛季通行证、任务和 SBC 进化。',
      playerSlang: '包含赛季通行证、任务和 SBC 进化。',
    },
    'Calculate GG Rating': {
      professional: '计算 GG 评分',
      playerSlang: '计算 GG 评分',
    },
    'Increases the time it takes to generate the paths.': {
      professional: '会增加生成路径所需时间。',
      playerSlang: '会增加生成路径所需时间。',
    },
    'Modify Settings': {
      professional: '调整设置',
      playerSlang: '调整设置',
    },
    'Adjust Settings': {
      professional: '调整设置',
      playerSlang: '调整设置',
    },
    Apply: { professional: '应用', playerSlang: '应用' },
    'Save as Draft': {
      professional: '保存为草稿',
      playerSlang: '保存为草稿',
    },
    'Save Draft': {
      professional: '保存草稿',
      playerSlang: '保存草稿',
    },
    'Search for Evolution': {
      professional: '搜索进化',
      playerSlang: '搜索进化',
    },
    'Search for an Evolution': {
      professional: '搜索进化',
      playerSlang: '搜索进化',
    },
    'Search Evolutions': {
      professional: '搜索进化',
      playerSlang: '搜索进化',
    },
    'First Match': {
      professional: '优先匹配',
      playerSlang: '优先匹配',
    },
    'Best Result': {
      professional: '最佳结果',
      playerSlang: '最佳结果',
    },
    'Max Evolutions': {
      professional: '最多进化数',
      playerSlang: '最多进化数',
    },
    'Reward Evolutions': {
      professional: '奖励进化',
      playerSlang: '奖励进化',
    },
    'GG Rating': { professional: 'GG 评分', playerSlang: 'GG 评分' },
    'Base Player': {
      professional: '基础球员',
      playerSlang: '基础球员',
    },
    Stop: { professional: '停止', playerSlang: '停止' },
    Saved: { professional: '已保存', playerSlang: '已保存' },
    Saving: { professional: '保存中', playerSlang: '保存中' },
    'Saving...': { professional: '保存中...', playerSlang: '保存中...' },
    'Expires on': { professional: '截止时间', playerSlang: '截止时间' },
    'Expires in': { professional: '剩余时间', playerSlang: '剩余时间' },
    'View Upgrades': { professional: '查看升级', playerSlang: '查看升级' },
    'Hide Upgrades': { professional: '隐藏升级', playerSlang: '隐藏升级' },
    'Preview Evolution': {
      professional: '预览进化',
      playerSlang: '预览进化',
    },
    'Preview Player': {
      professional: '预览球员',
      playerSlang: '预览球员',
    },
    FREE: { professional: '免费', playerSlang: '免费' },
    EVOLUTIONS: { professional: '进化', playerSlang: '进化' },
    UPGRADES: { professional: '升级', playerSlang: '升级' },
    PLAYERS: { professional: '球员', playerSlang: '球员' },
    OVR: { professional: '总评', playerSlang: '总评' },
    PAC: { professional: '速度', playerSlang: '速度' },
    SHO: { professional: '射门', playerSlang: '射门' },
    PAS: { professional: '传球', playerSlang: '传球' },
    DRI: { professional: '盘带', playerSlang: '盘带' },
    DEF: { professional: '防守', playerSlang: '防守' },
    PHY: { professional: '身体', playerSlang: '身体' },
    WF: { professional: '逆足', playerSlang: '逆足' },
    SM: { professional: '花式', playerSlang: '花式' },
    PS: { professional: '比赛风格', playerSlang: '比赛风格' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    'Skill Moves': { professional: '花式', playerSlang: '花式' },
    'Skill Move': { professional: '花式', playerSlang: '花式' },
    'PlayStyles': { professional: '比赛风格', playerSlang: '比赛风格' },
    'PlayStyle': { professional: '比赛风格', playerSlang: '比赛风格' },
    'PlayStyle+': { professional: '比赛风格+', playerSlang: '比赛风格+' },
    'Def. Aware.': {
      professional: '防守意识',
      playerSlang: '防守意识',
    },
    'Def. Aware': {
      professional: '防守意识',
      playerSlang: '防守意识',
    },
    'Defensive Awareness': {
      professional: '防守意识',
      playerSlang: '防守意识',
    },
    'Att. Pos.': { professional: '进攻位置', playerSlang: '进攻位置' },
  };

  const DYNAMIC_TEXT_REPLACEMENTS = [
    {
      regex: /^(?:Expires on\s+)?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})$/i,
      replace: (match, month, day, year) => {
        const monthNumber = getMonthNumber(month);
        const formatted = year + '年' + monthNumber + '月' + Number(day) + '日';
        return match.toLowerCase().startsWith('expires on')
          ? '截止时间 ' + formatted
          : formatted;
      },
    },
    {
      regex: /^Attempts:\s*(\d+\s*\/\s*\d+)\.?$/i,
      replace: (_match, attempts) => '尝试次数：' + attempts.replace(/\s+/g, ''),
    },
    {
      regex: /^Generated\s*([\d,]+)\s+paths?\.?$/i,
      replace: (_match, count) => '已生成 ' + count + ' 条路径',
    },
    {
      regex: /^Generating\s+paths(?:\.{3}|…)\s*\(([\d,]+)\)$/i,
      replace: (_match, count) => '正在生成路径...（' + count + '）',
    },
    {
      regex: /^未?Saved$/i,
      replace: () => '已保存',
    },
    {
      regex: /^([\d,]+)\s+paths?\.?$/i,
      replace: (_match, count) => count + ' 条路径',
    },
    {
      regex: /^in\s+(\d+)\s+days?$/i,
      replace: (_match, count) => '剩余 ' + count + ' 天',
    },
    {
      regex: /^in\s+(\d+)\s+months?$/i,
      replace: (_match, count) => '剩余 ' + count + ' 个月',
    },
    {
      regex: /^in\s+(\d+)\s+hours?$/i,
      replace: (_match, count) => '剩余 ' + count + ' 小时',
    },
    {
      regex: /^in\s+(\d+)\s+minutes?$/i,
      replace: (_match, count) => '剩余 ' + count + ' 分钟',
    },
  ];

  function getMonthNumber(monthText) {
    const monthMap = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };
    return monthMap[String(monthText || '').slice(0, 3).toLowerCase()] || monthText;
  }

  function isTargetPage(locationObj = window.location) {
    return Boolean(
      utils?.isFutggHost(locationObj) &&
        GG_CLUB_PAGE_REGEX.test(locationObj.pathname || '')
    );
  }

  function shouldSkipTextNode(textNode) {
    return Boolean(
      textNode?.parentElement?.closest(
        'script, style, svg, img, picture, canvas, video, ' +
          PLAYER_LINK_SELECTOR
      )
    );
  }

  function getDynamicReplacement(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) {
      return null;
    }
    for (const replacement of DYNAMIC_TEXT_REPLACEMENTS) {
      const matched = trimmed.match(replacement.regex);
      if (matched) {
        return trimmed.replace(replacement.regex, replacement.replace);
      }
    }
    return null;
  }

  function translateDynamicTextNode(textNode) {
    if (
      !textNode ||
      textNode.nodeType !== Node.TEXT_NODE ||
      shouldSkipTextNode(textNode)
    ) {
      return;
    }
    const currentValue = textNode.textContent || '';
    if (processedDynamicTextSnapshots.get(textNode) === currentValue) {
      return;
    }
    const replacement = getDynamicReplacement(currentValue);
    if (!replacement) {
      processedDynamicTextSnapshots.set(textNode, currentValue);
      return;
    }
    const leadingWhitespace = currentValue.match(/^\s*/)?.[0] || '';
    const trailingWhitespace = currentValue.match(/\s*$/)?.[0] || '';
    textNode.textContent = leadingWhitespace + replacement + trailingWhitespace;
    processedDynamicTextSnapshots.set(textNode, textNode.textContent || '');
  }

  function translateDynamicText(container) {
    if (!container) {
      return;
    }
    const ownerDocument = container.ownerDocument || document;
    const walker = ownerDocument.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      translateDynamicTextNode(currentNode);
      currentNode = walker.nextNode();
    }
  }

  function ensureObserver(container, dictionaries, options) {
    if (!container || observedContainers.has(container)) {
      return;
    }
    const dictionariesList = (dictionaries || []).filter(Boolean);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          const parent = mutation.target?.parentElement;
          if (parent) {
            utils.translateContainer(parent, dictionariesList, {
              ...options,
              shouldSkipTextNode,
            });
            translateDynamicText(parent);
          } else {
            translateDynamicTextNode(mutation.target);
          }
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateDynamicTextNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            utils.translateContainer(node, dictionariesList, {
              ...options,
              shouldSkipTextNode,
            });
            translateDynamicText(node);
          }
        });
      });
    });
    observer.observe(container, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    observedContainers.set(container, observer);
  }

  function translate(root, evolutionsDictionary, options = {}) {
    if (!isTargetPage()) {
      return;
    }
    const translationOptions = { ...options };
    const extraDictionaries = Array.isArray(translationOptions.extraDictionaries)
      ? translationOptions.extraDictionaries
      : [];
    delete translationOptions.extraDictionaries;
    const dictionaries = [
      evolutionsDictionary,
      GG_CLUB_DICTIONARY,
      ...extraDictionaries,
    ].filter(Boolean);
    const containers = utils.findContainers(root, CONTAINER_SELECTORS);
    containers.forEach((container) => {
      utils.translateContainer(container, dictionaries, {
        ...translationOptions,
        shouldSkipTextNode,
      });
      translateDynamicText(container);
    });
    if (document.body) {
      ensureObserver(document.body, dictionaries, translationOptions);
    }
  }

  window.wonderfutFutggGgClubTranslator = {
    translate,
    isTargetPage,
  };
})();
