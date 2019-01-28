import debug from 'debug';
const log = debug('csl:log');

// eslint-disable-next-line no-undef
if ($_CONFIG.CSL_ENV_IS_PRODUCTION) {
  debug.disable();
} else {
  debug.enable('csl:*');
  log('Logging is enabled!');
}

export default log;
