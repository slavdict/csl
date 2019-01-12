import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';

/* eslint-disable no-undef,no-constant-condition */
const baseURL = (CSL_ENV !== 'production' ? '' : '');
/* eslint-enable no-undef,no-constant-condition */
log('CSL portal');

const qs = window.URLSearchParams && (new URLSearchParams(document.location.search));
window[';)'] = {
  debug: qs && qs.has('debug') || false,
  debugVideo: qs && qs.has('debugVideo') || false,
};

function viewModel() {
  this.version = 'v' + 'CSL_VERSION';
  this.debug = window[';)'].debug;
}
const vM = new viewModel();
initKnockout(ko, vM);

// Настройка клиентской маршрутизации

page.base(baseURL);
page('/', () => {});
page({ hashbang: true });

jQuery('#safetyCurtain').fadeOut();
