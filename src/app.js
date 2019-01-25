import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';

/* eslint-disable-next-line no-undef */
if (!CSL_ENV_IS_PRODUCTION) log('CSL portal');

const qs = window.URLSearchParams && (new URLSearchParams(document.location.search));
window[';)'] = {
  debug: qs && qs.has('debug') || false,
};

function viewModel() {
  this.version = 'v' + 'CSL_VERSION';
  this.debug = window[';)'].debug;
  this.section = ko.observable();

  this.section.subscribe(log);
}
const vM = new viewModel();
initKnockout(ko, vM);

/* eslint-disable-next-line no-undef */
if (!CSL_ENV_IS_PRODUCTION) window.vM = vM;

// Настройка клиентской маршрутизации
const rootUrl = '/',
      dictionarySectionUrl = '/dictionary',
      dictionaryUrl = dictionarySectionUrl + '/dict',
      indexUrl = dictionarySectionUrl + '/index',
      dictionaryAboutUrl = dictionarySectionUrl + '/about',
      videoUrl = '/video',
      refsUrl = '/refs',
      feedbackUrl = '/feedback',
      debugURLs = [
        rootUrl,
        dictionarySectionUrl,
        dictionaryUrl,
        indexUrl,
        dictionaryAboutUrl,
        '/dictionary/-search',
        '/dictionary/-tip',
        '/dictionary/-article',
        '/dictionary/-article-tip',
        videoUrl,
        refsUrl,
        feedbackUrl,
      ];
/* eslint-disable-next-line no-undef */
if (!CSL_ENV_IS_PRODUCTION) log(debugURLs);

log('page routes adjustment');
page(rootUrl, () => { vM.section(null); });
page(dictionarySectionUrl, () => { vM.section('dictionary'); });
page(dictionaryAboutUrl, () => { log('about dictionary url'); });
page(videoUrl, () => { vM.section('video'); });
page(refsUrl, () => { vM.section('refs'); });
page(feedbackUrl, () => { vM.section('feedback'); });
page('*', rootUrl);
page({ hashbang: true });

jQuery('#safetyCurtain').fadeOut();
