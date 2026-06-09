(() => {
  const utils = window.wonderfutFutggTranslationUtils;
  const PLAYER_DETAILS_PAGE_REGEX = /^\/players\/\d+-.+\/\d+-\d+\/?$/i;
  const processedTextSnapshots = new WeakMap();
  const dictionaryEntriesCache = new WeakMap();
  const UI_DICTIONARY = {
    OVERVIEW: { professional: '概览', playerSlang: '概览' },
    OBJECTIVE: { professional: '任务', playerSlang: '任务' },
    COMMENTS: { professional: '评论', playerSlang: '评论' },
    COMPARE: { professional: '对比', playerSlang: '对比' },
    'GG Rating': { professional: 'GG 评分', playerSlang: 'GG 评分' },
    'What is GG Rating?': { professional: '什么是 GG 评分？', playerSlang: '什么是 GG 评分？' },
    Attributes: { professional: '属性', playerSlang: '属性' },
    Actions: { professional: '操作', playerSlang: '操作' },
    'Add to Evo Lab': { professional: '添加到进化实验室', playerSlang: '添加到进化实验室' },
    'Add to Compare': { professional: '添加到对比', playerSlang: '添加到对比' },
    'Other Versions': { professional: '其他版本', playerSlang: '其他版本' },
    'Player Information': { professional: '球员信息', playerSlang: '球员信息' },
    Name: { professional: '姓名', playerSlang: '姓名' },
    Club: { professional: '俱乐部', playerSlang: '俱乐部' },
    League: { professional: '联赛', playerSlang: '联赛' },
    Nation: { professional: '国家/地区', playerSlang: '国家/地区' },
    Rarity: { professional: '稀有度', playerSlang: '稀有度' },
    Squad: { professional: '卡面', playerSlang: '卡面' },
    Height: { professional: '身高', playerSlang: '身高' },
    Weight: { professional: '体重', playerSlang: '体重' },
    Foot: { professional: '惯用脚', playerSlang: '惯用脚' },
    Right: { professional: '右脚', playerSlang: '右脚' },
    Left: { professional: '左脚', playerSlang: '左脚' },
    'Skill Moves': { professional: '花式', playerSlang: '花式' },
    'Weak Foot': { professional: '逆足', playerSlang: '逆足' },
    AcceleRATE: { professional: '加速类型', playerSlang: '加速类型' },
    Explosive: { professional: '爆发', playerSlang: '爆发' },
    Controlled: { professional: '掌控', playerSlang: '掌控' },
    Lengthy: { professional: '漫长', playerSlang: '漫长' },
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
    'Real Face': { professional: '真实脸型', playerSlang: '真实脸型' },
    Yes: { professional: '是', playerSlang: '是' },
    No: { professional: '否', playerSlang: '否' },
    'Shirt Number': { professional: '球衣号码', playerSlang: '球衣号码' },
    Age: { professional: '年龄', playerSlang: '年龄' },
    'Player ID': { professional: '球员 ID', playerSlang: '球员 ID' },
    'Item ID': { professional: '物品 ID', playerSlang: '物品 ID' },
    'Added On': { professional: '添加时间', playerSlang: '添加时间' },
    'Show Roles': { professional: '显示角色', playerSlang: '显示角色' },
    'active paths': { professional: '条可用路径', playerSlang: '条可用路径' },
    'TIER VOTE': { professional: '评级投票', playerSlang: '评级投票' },
    placements: { professional: '次投票', playerSlang: '次投票' },
    'Where would you place': { professional: '你会把', playerSlang: '你会把' },
    'PlayStyles': { professional: '比赛风格', playerSlang: '比赛风格' },
    FINISHING: { professional: '射门', playerSlang: '射门' },
    PASSING: { professional: '传球', playerSlang: '传球' },
    DEFENDING: { professional: '防守', playerSlang: '防守' },
    'BALL CONTROL': { professional: '控球', playerSlang: '控球' },
    PHYSICAL: { professional: '身体', playerSlang: '身体' },
    GOALKEEPING: { professional: '守门', playerSlang: '守门' },
    'PlayStyle Effect': { professional: '比赛风格效果', playerSlang: '比赛风格效果' },
    'PlayStyle+ Effect': { professional: '比赛风格+效果', playerSlang: '比赛风格+效果' },
    'See players with this PlayStyle': { professional: '查看拥有此比赛风格的球员', playerSlang: '查看拥有此比赛风格的球员' },
    'Community Chemistry Styles': { professional: '社区化学风格', playerSlang: '社区化学风格' },
    'Select a chemistry style to vote': { professional: '选择一个化学风格进行投票', playerSlang: '选择一个化学风格进行投票' },
    'View Objective': { professional: '查看任务', playerSlang: '查看任务' },
    EXPIRED: { professional: '已过期', playerSlang: '已过期' },
    'Basic': { professional: '基础', playerSlang: '基础' },
    'OVR': { professional: '总评', playerSlang: '总评' },
    'Ranked': { professional: '排名', playerSlang: '排名' },
    'Attacking Wingback': { professional: '进攻型边翼卫', playerSlang: '进攻型边翼卫' },
    Wingback: { professional: '边翼卫', playerSlang: '边翼卫' },
    'Wide Midfielder': { professional: '边前卫', playerSlang: '边前卫' },
  };

  function isTargetPage(locationObj = window.location) {
    return Boolean(
      utils?.isFutggHost(locationObj) &&
        PLAYER_DETAILS_PAGE_REGEX.test(locationObj.pathname || '')
    );
  }

  function selectPreferredEntry(entry, options = {}) {
    if (!entry) {
      return '';
    }
    const professional = entry.professional || entry.playerSlang || '';
    const playerSlang = entry.playerSlang || entry.professional || '';
    return options.usePlayerSlang ? playerSlang : professional;
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getReplacementEntries(dictionary, options = {}) {
    if (!dictionary || typeof dictionary !== 'object') {
      return [];
    }
    let cached = dictionaryEntriesCache.get(dictionary);
    if (!cached) {
      cached = Object.entries(dictionary)
        .map(([english, entry]) => ({ english, entry }))
        .filter(({ english }) => english && String(english).trim().length >= 3)
        .sort((a, b) => String(b.english).length - String(a.english).length);
      dictionaryEntriesCache.set(dictionary, cached);
    }
    return cached.map(({ english, entry }) => ({
      english,
      replacement: selectPreferredEntry(entry, options),
    }));
  }

  function replaceDictionaryTerms(value, dictionaries, options = {}) {
    let nextValue = String(value || '');
    dictionaries.forEach((dictionary) => {
      getReplacementEntries(dictionary, options).forEach(({ english, replacement }) => {
        if (!replacement || nextValue.includes(replacement)) {
          return;
        }
        const pattern = new RegExp(
          '(^|[^A-Za-z0-9])(' + escapeRegExp(english) + ')(?=$|[^A-Za-z0-9])',
          'g'
        );
        nextValue = nextValue.replace(pattern, '$1' + replacement);
      });
    });
    return nextValue;
  }

  function shouldSkipTextNode(textNode) {
    return Boolean(textNode?.parentElement?.closest('script, style, svg'));
  }

  function translateLongText(container, dictionaries, options = {}) {
    const ownerDocument = container.ownerDocument || document;
    const walker = ownerDocument.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (!shouldSkipTextNode(currentNode)) {
        const currentValue = currentNode.textContent || '';
        if (processedTextSnapshots.get(currentNode) !== currentValue) {
          const nextValue = replaceDictionaryTerms(
            currentValue,
            dictionaries,
            options
          );
          if (nextValue !== currentValue) {
            currentNode.textContent = nextValue;
          }
          processedTextSnapshots.set(currentNode, currentNode.textContent || '');
        }
      }
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
    const translationOptions = { ...options };
    delete translationOptions.extraDictionaries;
    const dictionaries = [UI_DICTIONARY, ...extraDictionaries].filter(Boolean);
    const containers = utils.findContainers(root, ['main', 'aside']);
    containers.forEach((container) => {
      utils.translateContainer(container, dictionaries, {
        ...translationOptions,
        shouldSkipTextNode,
      });
      translateLongText(container, dictionaries, translationOptions);
    });
  }

  window.wonderfutFutggPlayerDetailsTranslator = {
    translate,
    isTargetPage,
  };
})();
