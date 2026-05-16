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
  const futggEvolutionsTranslator = window.wonderfutFutggEvolutionsTranslator;
  const futggEvoLabTranslator = window.wonderfutFutggEvoLabTranslator;
  const futbinPlayerStatsTranslator =
    window.wonderfutFutbinPlayerStatsTranslator;
  const REFRESH_BUTTON_ID = 'wonderfut-refresh-evolutions-button';
  const REFRESH_BUTTON_DEFAULT_TEXT = '获取新翻译';
  const LOCATION_CHECK_INTERVAL_MS = 1000;
  const HOMEPAGE_BANNER_ID = 'wonderfut-homepage-banner';

  if (
    !dictionaryLoader ||
    !baseInfoTranslator ||
    !sixStatTranslator ||
    !roleTranslator ||
    !squadTranslator ||
    !chemistryTranslator ||
    !playstylesTranslator ||
    !evolutionsTranslator ||
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
    futggEvoLab: null,
    futbinPlayerStats: null,
    others: null,
  };
  let dictionaryLoadPromise = null;

  async function ensureDictionaries() {
    if (
      dictionaryCache.basic &&
      dictionaryCache.sixStat &&
      dictionaryCache.roles &&
      dictionaryCache.squad &&
      dictionaryCache.chemistry &&
      dictionaryCache.playstyles &&
      dictionaryCache.evolutions &&
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
      futggEvolutionsTranslator.translate(
        root,
        dictionaries.evolutions,
        {
          usePlayerSlang: USE_PLAYER_SLANG,
          showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
        }
      );
      futggEvoLabTranslator.translate(
        root,
        dictionaries.futggEvoLab,
        {
          usePlayerSlang: USE_PLAYER_SLANG,
          showOriginalWithBrackets: SHOW_ORIGINAL_WITH_BRACKETS,
          extraDictionaries: [
            dictionaries.sixStat,
            dictionaries.playstyles,
            dictionaries.roles,
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

  function handleMutations(mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          translateRoot(node);
        }
      });
    });
    syncRefreshButtonState();
  }

  function isEvolutionPage() {
    return [evolutionsTranslator, futggEvolutionsTranslator, futggEvoLabTranslator].some(
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
    if (!dictionaryLoader || typeof dictionaryLoader.forceRefreshEvolutionsDictionary !== 'function') {
      console.error('Dictionary loader cannot refresh evolutions dictionary.');
      return;
    }
    button.disabled = true;
    button.textContent = '获取中...';
    try {
      const updatedDictionary =
        await dictionaryLoader.forceRefreshEvolutionsDictionary();
      dictionaryCache.evolutions = updatedDictionary;
      await translateRoot(document);
      button.textContent = '更新成功';
      setTimeout(() => {
        button.textContent = REFRESH_BUTTON_DEFAULT_TEXT;
      }, 1500);
    } catch (error) {
      console.error('Failed to refresh evolutions dictionary:', error);
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
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
    monitorEvolutionPageChanges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
