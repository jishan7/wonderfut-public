(() => {
  const USE_PLAYER_SLANG = true;
  const SHOW_ORIGINAL_WITH_BRACKETS = false;

  const dictionaryLoader = window.wonderfutDictionaryLoader;
  const baseInfoTranslator = window.wonderfutBaseInfoTranslator;
  const sixStatTranslator = window.wonderfutSixStatTranslator;
  const roleTranslator = window.wonderfutRoleTranslator;
  const squadTranslator = window.wonderfutSquadTranslator;
  const chemistryTranslator = window.wonderfutChemistryTranslator;
  const playstylesTranslator = window.wonderfutPlaystylesTranslator;
  const evolutionsTranslator = window.wonderfutEvolutionsTranslator;
  const futbinTranslator = window.wonderfutFutbinTranslator;
  const futggCommonTranslator = window.wonderfutFutggCommonTranslator;
  const futggPlayerPopoverTranslator =
    window.wonderfutFutggPlayerPopoverTranslator;
  const futggPlayerDetailsTranslator =
    window.wonderfutFutggPlayerDetailsTranslator;
  const futggPlayersTranslator = window.wonderfutFutggPlayersTranslator;
  const futggEvolutionsListTranslator =
    window.wonderfutFutggEvolutionsListTranslator;
  const futggTrendingEvolutionsTranslator =
    window.wonderfutFutggTrendingEvolutionsTranslator;
  const futggGgClubTranslator = window.wonderfutFutggGgClubTranslator;
  const futggEvolutionsTranslator = window.wonderfutFutggEvolutionsTranslator;
  const futggEvoLabTranslator = window.wonderfutFutggEvoLabTranslator;
  const futbinPlayerStatsTranslator =
    window.wonderfutFutbinPlayerStatsTranslator;
  const REFRESH_BUTTON_ID = 'wonderfut-refresh-evolutions-button';
  const REFRESH_BUTTON_DEFAULT_TEXT = '获取新翻译';
  const LOCATION_CHECK_INTERVAL_MS = 1000;
  const HOMEPAGE_BANNER_ID = 'wonderfut-homepage-banner';
  const AUTO_REFRESH_DELAY_MS = 8000;

  if (
    !dictionaryLoader ||
    !baseInfoTranslator ||
    !sixStatTranslator ||
    !roleTranslator ||
    !squadTranslator ||
    !chemistryTranslator ||
    !playstylesTranslator ||
    !evolutionsTranslator ||
    !futbinTranslator ||
    !futggCommonTranslator ||
    !futggPlayerPopoverTranslator ||
    !futggPlayerDetailsTranslator ||
    !futggPlayersTranslator ||
    !futggEvolutionsListTranslator ||
    !futggTrendingEvolutionsTranslator ||
    !futggGgClubTranslator ||
    !futggEvolutionsTranslator ||
    !futggEvoLabTranslator ||
    !futbinPlayerStatsTranslator
  ) {
    console.error('WonderFut translator failed to initialize.');
    return;
  }

  const dictionaryCache = {
    basic: null,
    sixStat: null,
    roles: null,
    squad: null,
    chemistry: null,
    playstyles: null,
    evolutions: null,
    rarity: null,
    futggEvoLab: null,
    futbinPlayerStats: null,
    others: null,
  };
  let dictionaryLoadPromise = null;
  let autoRefreshStarted = false;
  const pendingTranslationRoots = new Set();
  let pendingTranslationFrame = null;

  async function ensureDictionaries() {
    if (
      dictionaryCache.basic &&
      dictionaryCache.sixStat &&
      dictionaryCache.roles &&
      dictionaryCache.squad &&
      dictionaryCache.chemistry &&
      dictionaryCache.playstyles &&
      dictionaryCache.evolutions &&
      dictionaryCache.rarity &&
      dictionaryCache.others
    ) {
      return dictionaryCache;
    }
    if (!dictionaryLoadPromise) {
      dictionaryLoadPromise = Promise.all([
        dictionaryLoader.loadBasicInfoDictionary(),
        dictionaryLoader.loadSixStatDictionary(),
        dictionaryLoader.loadRolesDictionary(),
        dictionaryLoader.loadSquadDictionary(),
        dictionaryLoader.loadChemistryDictionary(),
        dictionaryLoader.loadPlaystylesDictionary(),
        dictionaryLoader.loadEvolutionsDictionary(),
        dictionaryLoader.loadRarityDictionary(),
        dictionaryLoader.loadFutggEvoLabDictionary(),
        dictionaryLoader.loadFutbinPlayerStatsDictionary(),
        dictionaryLoader.loadOthersDictionary(),
      ])
        .then(
          ([
            basic,
            sixStat,
            roles,
            squad,
            chemistry,
            playstyles,
            evolutions,
            rarity,
            futggEvoLab,
            futbinPlayerStats,
            others,
          ]) => {
            dictionaryCache.basic = basic;
            dictionaryCache.sixStat = sixStat;
            dictionaryCache.roles = roles;
            dictionaryCache.squad = squad;
            dictionaryCache.chemistry = chemistry;
            dictionaryCache.playstyles = playstyles;
            dictionaryCache.evolutions = evolutions;
            dictionaryCache.rarity = rarity;
            dictionaryCache.futggEvoLab = futggEvoLab;
            dictionaryCache.futbinPlayerStats = futbinPlayerStats;
            dictionaryCache.others = others;
            return dictionaryCache;
          }
        )
        .finally(() => {
          dictionaryLoadPromise = null;
        });
    }
    return dictionaryLoadPromise;
  }

  async function translateRoot(root) {
    try {
      const dictionaries = await ensureDictionaries();
      baseInfoTranslator.translate(root, dictionaries.basic, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      sixStatTranslator.translate(root, dictionaries.sixStat, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      roleTranslator.translate(root, dictionaries.roles, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      squadTranslator.translate(root, dictionaries.squad, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      chemistryTranslator.translate(root, dictionaries.chemistry, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        accelerateTranslations: dictionaries.others?.accelerate,
      });
      playstylesTranslator.translate(root, dictionaries.playstyles, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      evolutionsTranslator.translate(root, dictionaries.evolutions, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      futbinTranslator.translate(root, null, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        extraDictionaries: [
          dictionaries.basic,
          dictionaries.evolutions,
          dictionaries.rarity,
          dictionaries.sixStat,
          dictionaries.chemistry,
          dictionaries.playstyles,
          dictionaries.roles,
          dictionaries.squad,
        ],
      });
      futggCommonTranslator.translate(root, null, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      futggPlayerPopoverTranslator.translate(root, null, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        extraDictionaries: [
          dictionaries.roles,
          dictionaries.chemistry,
          dictionaries.basic,
          dictionaries.squad,
          dictionaries.sixStat,
          dictionaries.playstyles,
        ],
      });
      futggPlayerDetailsTranslator.translate(root, null, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        extraDictionaries: [
          dictionaries.basic,
          dictionaries.sixStat,
          dictionaries.chemistry,
          dictionaries.playstyles,
          dictionaries.roles,
          dictionaries.rarity,
          dictionaries.evolutions,
          dictionaries.squad,
        ],
      });
      futggPlayersTranslator.translate(root, null, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        extraDictionaries: [
          dictionaries.sixStat,
          dictionaries.playstyles,
          dictionaries.roles,
          dictionaries.rarity,
        ],
      });
      futggEvolutionsListTranslator.translate(root, dictionaries.evolutions, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        extraDictionaries: [
          dictionaries.sixStat,
          dictionaries.playstyles,
          dictionaries.roles,
          dictionaries.rarity,
        ],
      });
      futggTrendingEvolutionsTranslator.translate(root, null, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
      });
      futggGgClubTranslator.translate(root, dictionaries.evolutions, {
        usePlayerSlang: USE_PLAYER_SLANG,
        showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        extraDictionaries: [
          dictionaries.sixStat,
          dictionaries.playstyles,
          dictionaries.roles,
          dictionaries.rarity,
        ],
      });
      futggEvolutionsTranslator.translate(
        root,
        dictionaries.evolutions,
        {
          usePlayerSlang: USE_PLAYER_SLANG,
          showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
          extraDictionaries: [
            dictionaries.sixStat,
            dictionaries.playstyles,
            dictionaries.roles,
            dictionaries.rarity,
          ],
        }
      );
      futggEvoLabTranslator.translate(
        root,
        dictionaries.futggEvoLab,
        {
          usePlayerSlang: USE_PLAYER_SLANG,
          showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
          extraDictionaries: [
            dictionaries.evolutions,
            dictionaries.sixStat,
            dictionaries.playstyles,
            dictionaries.roles,
            dictionaries.rarity,
          ],
          accelerateTranslations: dictionaries.others?.accelerate,
        }
      );
      futbinPlayerStatsTranslator.translate(
        root,
        dictionaries.futbinPlayerStats,
        {
          usePlayerSlang: USE_PLAYER_SLANG,
          showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        }
      );
    } catch (error) {
      console.error('WonderFut translation failed:', error);
    }
  }

  function flushPendingTranslations() {
    pendingTranslationFrame = null;
    const roots = Array.from(pendingTranslationRoots).filter((node, index, list) => {
      return !list.some((other, otherIndex) => {
        return (
          otherIndex !== index &&
          other &&
          node &&
          typeof other.contains === 'function' &&
          other.contains(node)
        );
      });
    });
    pendingTranslationRoots.clear();
    roots.forEach((node) => {
      translateRoot(node);
    });
    syncRefreshButtonState();
  }

  function scheduleTranslateRoot(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    pendingTranslationRoots.add(node);
    if (pendingTranslationFrame !== null) {
      return;
    }
    pendingTranslationFrame =
      typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame(flushPendingTranslations)
        : window.setTimeout(flushPendingTranslations, 16);
  }

  function handleMutations(mutations) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        scheduleTranslateRoot(mutation.target);
        return;
      }
      mutation.addedNodes.forEach((node) => {
        scheduleTranslateRoot(node);
      });
    });
  }

  function isEvolutionPage() {
    return [
      futggPlayersTranslator,
      evolutionsTranslator,
      futggEvolutionsListTranslator,
      futggTrendingEvolutionsTranslator,
      futggEvolutionsTranslator,
      futggEvoLabTranslator,
    ].some(
      (translator) =>
        translator &&
        typeof translator.isTargetPage === 'function' &&
        translator.isTargetPage()
    );
  }

  function createRefreshButtonIfNeeded() {
    if (document.getElementById(REFRESH_BUTTON_ID)) {
      return;
    }
    const button = document.createElement('button');
    button.id = REFRESH_BUTTON_ID;
    button.type = 'button';
    button.textContent = REFRESH_BUTTON_DEFAULT_TEXT;
    button.style.position = 'fixed';
    button.style.zIndex = '2147483647';
    button.style.bottom = '24px';
    button.style.right = '24px';
    button.style.padding = '10px 16px';
    button.style.borderRadius = '999px';
    button.style.border = 'none';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    button.style.cursor = 'pointer';
    button.style.transition = 'opacity 0.2s ease';
    button.addEventListener('mouseenter', () => {
      button.style.opacity = '0.85';
    });
    button.addEventListener('mouseleave', () => {
      button.style.opacity = '1';
    });
    button.addEventListener('click', handleRefreshButtonClick);
    document.body.appendChild(button);
  }

  function removeRefreshButtonIfExists() {
    const button = document.getElementById(REFRESH_BUTTON_ID);
    if (button) {
      button.remove();
    }
  }

  function syncRefreshButtonState() {
    if (isEvolutionPage()) {
      createRefreshButtonIfNeeded();
    } else {
      removeRefreshButtonIfExists();
    }
  }

  function getHomepageBannerConfig() {
    const { hostname, pathname } = window.location;
    const normalizedPath = pathname.replace(/\/+$/, '/') || '/';
    const isHomepage = normalizedPath === '/';
    if (!isHomepage) {
      return null;
    }
    if (hostname.includes('futbin.com')) {
      return {
        prefix: '文达翻译已加载。',
        linkText: '点击任意球员',
        linkHref: 'https://www.futbin.com/evolutions/builder/894',
        suffix: '进入详情页查看翻译。',
      };
    }
    if (hostname.includes('fut.gg')) {
      return {
        prefix: '文达翻译已加载。',
        linkText: '点击EvoLab',
        linkHref: 'https://www.fut.gg/evo-lab/',
        suffix: '进入页面查看进化翻译情况。',
      };
    }
    return null;
  }

  function createHomepageBannerIfNeeded() {
    if (document.getElementById(HOMEPAGE_BANNER_ID)) {
      return;
    }
    const config = getHomepageBannerConfig();
    if (!config) {
      return;
    }
    const banner = document.createElement('div');
    banner.id = HOMEPAGE_BANNER_ID;
    banner.style.position = 'fixed';
    banner.style.top = '72px';
    banner.style.right = '24px';
    banner.style.left = 'auto';
    banner.style.width = '25%';
    banner.style.minWidth = '240px';
    banner.style.maxWidth = '420px';
    banner.style.padding = '12px 48px 12px 16px';
    banner.style.background = 'linear-gradient(90deg,#101828,#1d4ed8)';
    banner.style.color = '#fff';
    banner.style.fontSize = '14px';
    banner.style.fontWeight = '600';
    banner.style.textAlign = 'left';
    banner.style.zIndex = '2147483647';
    banner.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';

    const prefixSpan = document.createElement('span');
    prefixSpan.textContent = `${config.prefix} `;

    const link = document.createElement('a');
    link.href = config.linkHref;
    link.textContent = config.linkText;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.color = '#60a5fa';
    link.style.textDecoration = 'underline';
    link.style.margin = '0 4px';

    const suffixSpan = document.createElement('span');
    suffixSpan.textContent = config.suffix;

    banner.appendChild(prefixSpan);
    banner.appendChild(link);
    banner.appendChild(suffixSpan);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', '关闭提醒');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '50%';
    closeButton.style.right = '12px';
    closeButton.style.transform = 'translateY(-50%)';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.color = '#fff';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
      banner.remove();
    });

    banner.appendChild(closeButton);
    document.body.appendChild(banner);
  }

  async function handleRefreshButtonClick(event) {
    const button = event.currentTarget;
    if (!dictionaryLoader || typeof dictionaryLoader.forceRefreshRemoteDictionaries !== 'function') {
      console.error('Dictionary loader cannot refresh remote dictionaries.');
      return;
    }
    button.disabled = true;
    button.textContent = '获取中...';
    try {
      const updatedDictionaries =
        await dictionaryLoader.forceRefreshRemoteDictionaries();
      dictionaryCache.evolutions = updatedDictionaries.evolutions;
      dictionaryCache.rarity = updatedDictionaries.rarity;
      await translateRoot(document);
      button.textContent = '更新成功';
      setTimeout(() => {
        button.textContent = REFRESH_BUTTON_DEFAULT_TEXT;
      }, 1500);
    } catch (error) {
      console.error('Failed to refresh remote dictionaries:', error);
      if (error?.stack) {
        console.error('Stack trace:', error.stack);
      }
      button.textContent = '获取失败';
      console.error(
        '获取新翻译失败：' + (error?.message || '未知错误')
      );
      console.error(
        '详细错误：',
        typeof error === 'object' ? JSON.parse(JSON.stringify(error)) : error
      );
      setTimeout(() => {
        button.textContent = REFRESH_BUTTON_DEFAULT_TEXT;
      }, 2000);
    } finally {
      button.disabled = false;
    }
  }

  function startAutoRefreshEvolutionsDictionary() {
    if (
      autoRefreshStarted ||
      !dictionaryLoader ||
      typeof dictionaryLoader.maybeRefreshRemoteDictionaries !== 'function'
    ) {
      return;
    }
    autoRefreshStarted = true;
    window.setTimeout(async () => {
      try {
        const result =
          await dictionaryLoader.maybeRefreshRemoteDictionaries();
        if (!result?.updated) {
          return;
        }
        if (result.evolutions?.dictionary) {
          dictionaryCache.evolutions = result.evolutions.dictionary;
        }
        if (result.rarity?.dictionary) {
          dictionaryCache.rarity = result.rarity.dictionary;
        }
        await translateRoot(document);
      } catch (error) {
        console.warn('WonderFut automatic translation refresh failed:', error);
      }
    }, AUTO_REFRESH_DELAY_MS);
  }

  function monitorEvolutionPageChanges() {
    const getLocationSignature = () => {
      if (!window.location) {
        return '';
      }
      return window.location.hostname + window.location.pathname;
    };
    let lastLocationSignature = getLocationSignature();

    const notifyIfChanged = () => {
      const nextSignature = getLocationSignature();
      if (nextSignature !== lastLocationSignature) {
        lastLocationSignature = nextSignature;
        syncRefreshButtonState();
      }
    };

    const wrapHistoryMethod = (methodName) => {
      const original = history[methodName];
      if (typeof original !== 'function') {
        return;
      }
      history[methodName] = function (...args) {
        const result = original.apply(this, args);
        notifyIfChanged();
        return result;
      };
    };

    wrapHistoryMethod('pushState');
    wrapHistoryMethod('replaceState');
    window.addEventListener('popstate', notifyIfChanged);
    window.setInterval(notifyIfChanged, LOCATION_CHECK_INTERVAL_MS);
  }

  function bootstrap() {
    translateRoot(document);
    syncRefreshButtonState();
    createRefreshButtonIfNeeded();
    createHomepageBannerIfNeeded();
    startAutoRefreshEvolutionsDictionary();
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'placeholder', 'title', 'value'],
    });
    monitorEvolutionPageChanges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
