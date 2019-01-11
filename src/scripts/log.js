import debug from 'debug';
const log = debug('csl:log');

// eslint-disable-next-line no-undef
if (CSL_ENV !== 'production') {
  debug.enable('csl:*');
  log('Logging is enabled!');
} else {
  debug.disable();
}

export default log;
