import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';

import { videos } from './scripts/videoData.js';

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) log('CSL portal');

const qs = window.URLSearchParams && (new URLSearchParams(document.location.search));
window[';)'] = {
  debug: qs && qs.has('debug') || false,
};

function viewModel() {
  this.debug = window[';)'].debug;
  this.section = ko.observable();
  this.indexIsOn = ko.observable(false);
  this.videos = videos;
}
const vM = new viewModel();
initKnockout(ko, vM);

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) window.vM = vM;

// Настройка клиентской маршрутизации
const rootUrl = '/',
      dictionaryUrl = '$_CONFIG.urls.dictionary',
      entriesUrl = '$_CONFIG.urls.entries',
      indexUrl = '$_CONFIG.urls.index',
      dictionaryAboutUrl = '$_CONFIG.urls.about',
      videoUrl = '$_CONFIG.urls.video',
      refsUrl = '$_CONFIG.urls.refs',
      feedbackUrl = '$_CONFIG.urls.feedback',
      debugURLs = [
        rootUrl,
        dictionaryUrl,
        entriesUrl,
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

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) log(debugURLs);

page(rootUrl, () => { vM.section(null); });
/*
page(dictionaryUrl, () => {
  vM.section('dictionary');
  if (vM.indexIsOn()) {
    page.redirect(indexUrl);
  } else {
    page.redirect(entriesUrl);
  }
});
page(dictionaryAboutUrl, () => { log('about dictionary url'); });
page(entriesUrl, () => { vM.section('dictionary'); vM.indexIsOn(false); });
page(indexUrl, () => { vM.section('dictionary'); vM.indexIsOn(true); });
*/
page(videoUrl, () => { vM.section('video'); });
//page(refsUrl, () => { vM.section('refs'); });
//page(feedbackUrl, () => { log('feedback'); });
page('*', rootUrl);
page({ hashbang: true });

jQuery('#safetyCurtain').fadeOut();
