const core = require('@actions/core');
const cache = require('@actions/cache');

const {
  EMSDK_SYS_CACHE,
  EMSDK_SYS_CACHE_KEY_STATE,
  EMSDK_SYS_CACHE_RESTORE_KEY_STATE,
  hashFiles,
} = require('./common');

async function saveEmsdkSysLibs() {
  const restoreKey = core.getState(EMSDK_SYS_CACHE_RESTORE_KEY_STATE);
  if (!restoreKey) {
    core.info('[WARN] Cannot find EMSDK_SYS_CACHE_RESTORE_KEY_STATE. Give up.');
    return;
  }

  const hashKey = hashFiles(`${EMSDK_SYS_CACHE}/**/*`);
  const key = restoreKey + hashKey;

  const cacheKey = core.getState(EMSDK_SYS_CACHE_KEY_STATE);
  if (key !== cacheKey) {
    const cacheId = cache.saveCache([EMSDK_SYS_CACHE], key);
    core.info(`Saved emsdk syscache using key: ${key}; cacheId: ${cacheId}`);
  } else {
    core.info(
      `Skipped saving emsdk syscache because cacheKey matched: ${cacheKey}.`
    );
  }
}

async function run() {
  try {
    await saveEmsdkSysLibs();
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
