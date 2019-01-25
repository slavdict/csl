import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';

/* eslint-disable-next-line no-constant-condition */
const baseURL = 'IS_PRODUCTION' ? 'http://CSL_DOMAIN_NAME/' : '';
log('CSL portal');

const qs = window.URLSearchParams && (new URLSearchParams(document.location.search));
window[';)'] = {
  debug: qs && qs.has('debug') || false,
};

function viewModel() {
  this.version = 'v' + 'CSL_VERSION';
  this.debug = window[';)'].debug;
}
const vM = new viewModel();
initKnockout(ko, vM);

// Настройка клиентской маршрутизации
const debugURLs = [
  '/',
  '/#!dictionary',
  '/#!dictionary/dict',
  '/#!dictionary/index',
  '/#!dictionary/about',
  '/#!dictionary/-search',
  '/#!dictionary/-tip',
  '/#!dictionary/-article',
  '/#!dictionary/-article-tip',
  '/#!video',
  '/#!refs',
  '/#!feedback',
];
/* eslint-disable-next-line no-constant-condition */
if ('CSL_DEBUG') log(debugURLs);

page.base(baseURL);
page('/', () => {});
page({ hashbang: true });

jQuery('#safetyCurtain').fadeOut();
