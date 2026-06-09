(() => {
  const BASIC_INFO_DICT_PATH = chrome.runtime.getURL(
    'data/futbinBasicInfoFromExcel.json'
  );
  const SIX_STAT_DICT_PATH = chrome.runtime.getURL('data/sixStat.json');
  const ROLES_DICT_PATH = chrome.runtime.getURL(
    'data/futbinRolesFromExcel.json'
  );
  const SQUAD_DICT_PATH = chrome.runtime.getURL(
    'data/futbinSquadFromExcel.json'
  );
  const CHEMISTRY_DICT_PATH = chrome.runtime.getURL(
    'data/futbinChemistryFromExcel.json'
  );
  const PLAYSTYLES_DICT_PATH = chrome.runtime.getURL(
    'data/futbinPlaystylesFromExcel.json'
  );
  const EVOLUTIONS_DICT_PATH = chrome.runtime.getURL('data/evolutions.json');
  const RARITY_DICT_PATH = chrome.runtime.getURL('data/rarity.json');
  const FUTGG_EVOLAB_DICT_PATH = chrome.runtime.getURL(
    'data/futggEvoLab.json'
  );
  const FUTBIN_PLAYER_STATS_DICT_PATH = chrome.runtime.getURL(
    'data/futbinPlayerStats.json'
  );
  const REMOTE_EVOLUTIONS_DICT_URL =
    'https://gitee.com/yuyuzhuoyi/wonderfut-translate/raw/master/evolutions.json';
  const REMOTE_RARITY_DICT_URL =
    'https://gitee.com/yuyuzhuoyi/wonderfut-translate/raw/master/rarity.json';
  const REMOTE_FETCH_MESSAGE_TYPE = 'wonderfut_remote_fetch';
  const EVOLUTIONS_STORAGE_KEY = 'wonderfut_evolutions_dict_cache';
  const RARITY_STORAGE_KEY = 'wonderfut_rarity_dict_cache';
  const MIN_EVOLUTIONS_ENTRY_COUNT = 100;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const AUTO_REFRESH_INTERVAL_MS = ONE_DAY_MS;
  const OTHERS_DICT_PATH = chrome.runtime.getURL('data/others.json');

  function getChromeStorageLocal() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        return chrome.storage.local;
      }
    } catch (error) {
      console.warn('WonderFut storage unavailable:', error);
    }
    return null;
  }

  function storageGet(storage, key) {
    return new Promise((resolve) => {
      if (!storage || !key) {
        resolve(null);
        return;
      }
      try {
        storage.get(key, (items) => {
          if (chrome.runtime?.lastError) {
            console.warn('Storage get failed:', chrome.runtime.lastError);
            resolve(null);
            return;
          }
          resolve(items?.[key] || null);
        });
      } catch (error) {
        console.warn('Storage get exception:', error);
        resolve(null);
      }
    });
  }

  function storageSet(storage, key, value) {
    return new Promise((resolve) => {
      if (!storage || !key) {
        resolve();
        return;
      }
      try {
        storage.set({ [key]: value }, () => {
          if (chrome.runtime?.lastError) {
            console.warn('Storage set failed:', chrome.runtime.lastError);
          }
          resolve();
        });
      } catch (error) {
        console.warn('Storage set exception:', error);
        resolve();
      }
    });
  }

  function isCacheEntryValid(entry) {
    return (
      entry &&
      typeof entry.timestamp === 'number' &&
      entry.data &&
      Date.now() - entry.timestamp < ONE_DAY_MS
    );
  }

  function countDictionaryEntries(dict) {
    if (!dict || typeof dict !== 'object') {
      return 0;
    }
    return Object.keys(dict).length;
  }

  function getDictionarySignature(dict) {
    if (!dict || typeof dict !== 'object') {
      return '0:0';
    }
    const keys = Object.keys(dict).sort();
    let hash = 0;
    let length = 0;
    keys.forEach((key) => {
      const entry = dict[key] || {};
      const value =
        key +
        ':' +
        String(entry.professional || '') +
        ':' +
        String(entry.playerSlang || '');
      length += value.length;
      for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
      }
    });
    return keys.length + ':' + length + ':' + hash.toString(16);
  }

  function isEvolutionsDictionaryCacheHealthy(data) {
    return countDictionaryEntries(data) >= MIN_EVOLUTIONS_ENTRY_COUNT;
  }

  function hasRuntimeMessaging() {
    return Boolean(
      typeof chrome !== 'undefined' &&
        chrome.runtime &&
        typeof chrome.runtime.sendMessage === 'function'
    );
  }

  function sendBackgroundFetchRequest(message) {
    return new Promise((resolve, reject) => {
      if (!hasRuntimeMessaging()) {
        reject(new Error('Runtime messaging is unavailable'));
        return;
      }
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime?.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function fetchRemoteJson(url) {
    if (!url) {
      throw new Error('Remote dictionary URL is missing');
    }
    const requestOptions = { cache: 'no-store' };

    if (hasRuntimeMessaging()) {
      try {
        const response = await sendBackgroundFetchRequest({
          type: REMOTE_FETCH_MESSAGE_TYPE,
          payload: { url, options: requestOptions },
        });
        if (!response) {
          throw new Error('Empty response from background fetch');
        }
        if (!response.ok) {
          throw new Error(
            response.error ||
              `Remote dictionary request failed: ${response.status}`
          );
        }
        try {
          return JSON.parse(response.body || '{}');
        } catch (error) {
          throw new Error('Failed to parse remote dictionary JSON');
        }
      } catch (error) {
        console.warn('Background remote fetch failed', error);
      }
    }
    throw new Error('Remote dictionary fetch is unavailable');
  }

  async function loadDictionaryWithRemoteFallback(options) {
    const { storageKey, remoteUrl, localPath } = options || {};
    const storage = getChromeStorageLocal();
    const cachedEntry = await storageGet(storage, storageKey);
    const shouldValidateEvolutionsCache = storageKey === EVOLUTIONS_STORAGE_KEY;
    if (isCacheEntryValid(cachedEntry)) {
      if (
        !shouldValidateEvolutionsCache ||
        isEvolutionsDictionaryCacheHealthy(cachedEntry.data)
      ) {
        return cachedEntry.data;
      }
      console.warn('Evolutions cache is unhealthy, fallback to remote/local.');
    }
    const staleData = cachedEntry?.data;

    if (remoteUrl) {
      try {
        const remoteJson = await fetchRemoteJson(remoteUrl);
        await storageSet(storage, storageKey, {
          timestamp: Date.now(),
          lastCheckedAt: Date.now(),
          signature: getDictionarySignature(remoteJson),
          data: remoteJson,
        });
        return remoteJson;
      } catch (error) {
        console.warn('Remote dictionary fetch failed, fallback to cache/local', error);
      }
    }

    if (
      staleData &&
      (!shouldValidateEvolutionsCache ||
        isEvolutionsDictionaryCacheHealthy(staleData))
    ) {
      return staleData;
    }

    const localResponse = await fetch(localPath);
    if (!localResponse.ok) {
      throw new Error('Failed to load local dictionary');
    }
    return localResponse.json();
  }

  async function fetchRemoteDictionary(remoteUrl) {
    return fetchRemoteJson(remoteUrl);
  }

  function normalizeTranslationDictionary(rawDict) {
    const normalized = {};
    if (!rawDict) {
      return normalized;
    }

    const entries = Array.isArray(rawDict)
      ? rawDict.map((entry) => [
          entry?.english || entry?.en || entry?.source || entry?.key,
          entry,
        ])
      : Object.entries(rawDict);

    entries.forEach(([english, entry]) => {
      if (!english) {
        return;
      }
      const translatedText =
        typeof entry === 'string'
          ? entry
          : entry?.professional ||
            entry?.playerSlang ||
            entry?.zh ||
            entry?.chinese ||
            entry?.cn ||
            entry?.value ||
            entry?.translation ||
            '';
      const professional = String(translatedText || '').trim();
      if (!professional) {
        return;
      }
      const playerSlang = String(
        typeof entry === 'string'
          ? professional
          : entry?.playerSlang || entry?.slang || professional
      ).trim();
      normalized[english.trim()] = {
        professional,
        playerSlang: playerSlang || professional,
      };
    });

    return normalized;
  }

  class TranslationDictionaryLoader {
    constructor() {
      this.basicInfoDictionary = null;
      this.sixStatDictionary = null;
      this.basicInfoLoadingPromise = null;
      this.sixStatLoadingPromise = null;
      this.rolesDictionary = null;
      this.rolesLoadingPromise = null;
      this.squadDictionary = null;
      this.squadLoadingPromise = null;
      this.chemistryDictionary = null;
      this.chemistryLoadingPromise = null;
      this.playstylesDictionary = null;
      this.playstylesLoadingPromise = null;
      this.evolutionsDictionary = null;
      this.evolutionsLoadingPromise = null;
      this.rarityDictionary = null;
      this.rarityLoadingPromise = null;
      this.futggEvoLabDictionary = null;
      this.futggEvoLabLoadingPromise = null;
      this.futbinPlayerStatsDictionary = null;
      this.futbinPlayerStatsLoadingPromise = null;
      this.othersDictionary = null;
      this.othersLoadingPromise = null;
    }

    async loadBasicInfoDictionary() {
      if (this.basicInfoDictionary) {
        return this.basicInfoDictionary;
      }
      if (!this.basicInfoLoadingPromise) {
        this.basicInfoLoadingPromise = fetch(BASIC_INFO_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin basic info dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.basicInfoDictionary = normalizeTranslationDictionary(json);
            return this.basicInfoDictionary;
          })
          .finally(() => {
            this.basicInfoLoadingPromise = null;
          });
      }
      return this.basicInfoLoadingPromise;
    }

    async loadSixStatDictionary() {
      if (this.sixStatDictionary) {
        return this.sixStatDictionary;
      }
      if (!this.sixStatLoadingPromise) {
        this.sixStatLoadingPromise = fetch(SIX_STAT_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin six stat dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.sixStatDictionary = normalizeTranslationDictionary(json);
            return this.sixStatDictionary;
          })
          .finally(() => {
            this.sixStatLoadingPromise = null;
          });
      }
      return this.sixStatLoadingPromise;
    }

    async loadRolesDictionary() {
      if (this.rolesDictionary) {
        return this.rolesDictionary;
      }
      if (!this.rolesLoadingPromise) {
        this.rolesLoadingPromise = fetch(ROLES_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin roles dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.rolesDictionary = normalizeTranslationDictionary(json);
            return this.rolesDictionary;
          })
          .finally(() => {
            this.rolesLoadingPromise = null;
          });
      }
      return this.rolesLoadingPromise;
    }

    async loadSquadDictionary() {
      if (this.squadDictionary) {
        return this.squadDictionary;
      }
      if (!this.squadLoadingPromise) {
        this.squadLoadingPromise = fetch(SQUAD_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin squad dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.squadDictionary = normalizeTranslationDictionary(json);
            return this.squadDictionary;
          })
          .finally(() => {
            this.squadLoadingPromise = null;
          });
      }
      return this.squadLoadingPromise;
    }

    async loadChemistryDictionary() {
      if (this.chemistryDictionary) {
        return this.chemistryDictionary;
      }
      if (!this.chemistryLoadingPromise) {
        this.chemistryLoadingPromise = fetch(CHEMISTRY_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin chemistry dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.chemistryDictionary = normalizeTranslationDictionary(json);
            return this.chemistryDictionary;
          })
          .finally(() => {
            this.chemistryLoadingPromise = null;
          });
      }
      return this.chemistryLoadingPromise;
    }

    async loadPlaystylesDictionary() {
      if (this.playstylesDictionary) {
        return this.playstylesDictionary;
      }
      if (!this.playstylesLoadingPromise) {
        this.playstylesLoadingPromise = fetch(PLAYSTYLES_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin playstyles dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.playstylesDictionary = normalizeTranslationDictionary(json);
            return this.playstylesDictionary;
          })
          .finally(() => {
            this.playstylesLoadingPromise = null;
          });
      }
      return this.playstylesLoadingPromise;
    }

    async loadEvolutionsDictionary() {
      if (this.evolutionsDictionary) {
        return this.evolutionsDictionary;
      }
      if (!this.evolutionsLoadingPromise) {
        this.evolutionsLoadingPromise = loadDictionaryWithRemoteFallback({
          storageKey: EVOLUTIONS_STORAGE_KEY,
          remoteUrl: REMOTE_EVOLUTIONS_DICT_URL,
          localPath: EVOLUTIONS_DICT_PATH,
        })
          .then((json) => {
            this.evolutionsDictionary = normalizeTranslationDictionary(json);
            return this.evolutionsDictionary;
          })
          .finally(() => {
            this.evolutionsLoadingPromise = null;
          });
      }
      return this.evolutionsLoadingPromise;
    }

    async loadRarityDictionary() {
      if (this.rarityDictionary) {
        return this.rarityDictionary;
      }
      if (!this.rarityLoadingPromise) {
        this.rarityLoadingPromise = loadDictionaryWithRemoteFallback({
          storageKey: RARITY_STORAGE_KEY,
          remoteUrl: REMOTE_RARITY_DICT_URL,
          localPath: RARITY_DICT_PATH,
        })
          .then((json) => {
            this.rarityDictionary = normalizeTranslationDictionary(json);
            return this.rarityDictionary;
          })
          .finally(() => {
            this.rarityLoadingPromise = null;
          });
      }
      return this.rarityLoadingPromise;
    }

    async loadFutggEvoLabDictionary() {
      if (this.futggEvoLabDictionary) {
        return this.futggEvoLabDictionary;
      }
      if (!this.futggEvoLabLoadingPromise) {
        this.futggEvoLabLoadingPromise = fetch(FUTGG_EVOLAB_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futgg Evo Lab dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.futggEvoLabDictionary = normalizeTranslationDictionary(json);
            return this.futggEvoLabDictionary;
          })
          .finally(() => {
            this.futggEvoLabLoadingPromise = null;
          });
      }
      return this.futggEvoLabLoadingPromise;
    }

    async loadFutbinPlayerStatsDictionary() {
      if (this.futbinPlayerStatsDictionary) {
        return this.futbinPlayerStatsDictionary;
      }
      if (!this.futbinPlayerStatsLoadingPromise) {
        this.futbinPlayerStatsLoadingPromise = fetch(
          FUTBIN_PLAYER_STATS_DICT_PATH
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load futbin player stats dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.futbinPlayerStatsDictionary =
              normalizeTranslationDictionary(json);
            return this.futbinPlayerStatsDictionary;
          })
          .finally(() => {
            this.futbinPlayerStatsLoadingPromise = null;
          });
      }
      return this.futbinPlayerStatsLoadingPromise;
    }

    async loadOthersDictionary() {
      if (this.othersDictionary) {
        return this.othersDictionary;
      }
      if (!this.othersLoadingPromise) {
        this.othersLoadingPromise = fetch(OTHERS_DICT_PATH)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to load additional translations dictionary');
            }
            return response.json();
          })
          .then((json) => {
            this.othersDictionary = json || {};
            return this.othersDictionary;
          })
          .finally(() => {
            this.othersLoadingPromise = null;
          });
      }
      return this.othersLoadingPromise;
    }

    async forceRefreshEvolutionsDictionary() {
      if (this.evolutionsLoadingPromise) {
        await this.evolutionsLoadingPromise;
      }
      const storage = getChromeStorageLocal();
      const remoteJson = await fetchRemoteDictionary(REMOTE_EVOLUTIONS_DICT_URL);
      await storageSet(storage, EVOLUTIONS_STORAGE_KEY, {
        timestamp: Date.now(),
        lastCheckedAt: Date.now(),
        signature: getDictionarySignature(remoteJson),
        data: remoteJson,
      });
      this.evolutionsDictionary = normalizeTranslationDictionary(remoteJson);
      return this.evolutionsDictionary;
    }

    async forceRefreshRemoteDictionaries() {
      const [evolutionsResult, rarityResult] = await Promise.allSettled([
        this.forceRefreshEvolutionsDictionary(),
        this.forceRefreshRarityDictionary(),
      ]);
      if (
        evolutionsResult.status === 'rejected' &&
        rarityResult.status === 'rejected'
      ) {
        throw evolutionsResult.reason || rarityResult.reason;
      }
      return {
        evolutions:
          evolutionsResult.status === 'fulfilled'
            ? evolutionsResult.value
            : this.evolutionsDictionary,
        rarity:
          rarityResult.status === 'fulfilled'
            ? rarityResult.value
            : this.rarityDictionary,
      };
    }

    async forceRefreshRarityDictionary() {
      if (this.rarityLoadingPromise) {
        await this.rarityLoadingPromise;
      }
      const storage = getChromeStorageLocal();
      const remoteJson = await fetchRemoteDictionary(REMOTE_RARITY_DICT_URL);
      await storageSet(storage, RARITY_STORAGE_KEY, {
        timestamp: Date.now(),
        lastCheckedAt: Date.now(),
        signature: getDictionarySignature(remoteJson),
        data: remoteJson,
      });
      this.rarityDictionary = normalizeTranslationDictionary(remoteJson);
      return this.rarityDictionary;
    }

    async maybeRefreshEvolutionsDictionary() {
      if (this.evolutionsLoadingPromise) {
        await this.evolutionsLoadingPromise;
      }
      const storage = getChromeStorageLocal();
      const cachedEntry = await storageGet(storage, EVOLUTIONS_STORAGE_KEY);
      const now = Date.now();
      if (
        cachedEntry?.lastCheckedAt &&
        now - cachedEntry.lastCheckedAt < AUTO_REFRESH_INTERVAL_MS
      ) {
        return {
          checked: false,
          updated: false,
          dictionary: this.evolutionsDictionary,
        };
      }

      let remoteJson = null;
      try {
        remoteJson = await fetchRemoteDictionary(REMOTE_EVOLUTIONS_DICT_URL);
      } catch (error) {
        if (cachedEntry) {
          await storageSet(storage, EVOLUTIONS_STORAGE_KEY, {
            ...cachedEntry,
            lastCheckedAt: now,
          });
        }
        return {
          checked: true,
          updated: false,
          dictionary: this.evolutionsDictionary,
          error,
        };
      }

      if (!isEvolutionsDictionaryCacheHealthy(remoteJson)) {
        if (cachedEntry) {
          await storageSet(storage, EVOLUTIONS_STORAGE_KEY, {
            ...cachedEntry,
            lastCheckedAt: now,
          });
        }
        return {
          checked: true,
          updated: false,
          dictionary: this.evolutionsDictionary,
        };
      }

      const remoteSignature = getDictionarySignature(remoteJson);
      const cachedSignature =
        cachedEntry?.signature || getDictionarySignature(cachedEntry?.data);
      if (remoteSignature === cachedSignature) {
        await storageSet(storage, EVOLUTIONS_STORAGE_KEY, {
          ...cachedEntry,
          lastCheckedAt: now,
          signature: remoteSignature,
        });
        return {
          checked: true,
          updated: false,
          dictionary: this.evolutionsDictionary,
        };
      }

      await storageSet(storage, EVOLUTIONS_STORAGE_KEY, {
        timestamp: now,
        lastCheckedAt: now,
        signature: remoteSignature,
        data: remoteJson,
      });
      this.evolutionsDictionary = normalizeTranslationDictionary(remoteJson);
      return {
        checked: true,
        updated: true,
        dictionary: this.evolutionsDictionary,
      };
    }

    async maybeRefreshRarityDictionary() {
      if (this.rarityLoadingPromise) {
        await this.rarityLoadingPromise;
      }
      const storage = getChromeStorageLocal();
      const cachedEntry = await storageGet(storage, RARITY_STORAGE_KEY);
      const now = Date.now();
      if (
        cachedEntry?.lastCheckedAt &&
        now - cachedEntry.lastCheckedAt < AUTO_REFRESH_INTERVAL_MS
      ) {
        return {
          checked: false,
          updated: false,
          dictionary: this.rarityDictionary,
        };
      }

      let remoteJson = null;
      try {
        remoteJson = await fetchRemoteDictionary(REMOTE_RARITY_DICT_URL);
      } catch (error) {
        if (cachedEntry) {
          await storageSet(storage, RARITY_STORAGE_KEY, {
            ...cachedEntry,
            lastCheckedAt: now,
          });
        }
        return {
          checked: true,
          updated: false,
          dictionary: this.rarityDictionary,
          error,
        };
      }

      const remoteSignature = getDictionarySignature(remoteJson);
      const cachedSignature =
        cachedEntry?.signature || getDictionarySignature(cachedEntry?.data);
      if (remoteSignature === cachedSignature) {
        await storageSet(storage, RARITY_STORAGE_KEY, {
          ...cachedEntry,
          lastCheckedAt: now,
          signature: remoteSignature,
        });
        return {
          checked: true,
          updated: false,
          dictionary: this.rarityDictionary,
        };
      }

      await storageSet(storage, RARITY_STORAGE_KEY, {
        timestamp: now,
        lastCheckedAt: now,
        signature: remoteSignature,
        data: remoteJson,
      });
      this.rarityDictionary = normalizeTranslationDictionary(remoteJson);
      return {
        checked: true,
        updated: true,
        dictionary: this.rarityDictionary,
      };
    }

    async maybeRefreshRemoteDictionaries() {
      const [evolutionsResult, rarityResult] = await Promise.all([
        this.maybeRefreshEvolutionsDictionary(),
        this.maybeRefreshRarityDictionary(),
      ]);
      return {
        evolutions: evolutionsResult,
        rarity: rarityResult,
        updated: Boolean(evolutionsResult?.updated || rarityResult?.updated),
      };
    }
  }

  window.wonderfutDictionaryLoader = new TranslationDictionaryLoader();
})();
