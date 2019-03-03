import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';
import { searchEntries } from './scripts/searchEntries.js';

import { videos } from './scripts/videoData.js';
import { articles } from './scraps/stubdata/articlesData.js';
import { refs } from './scraps/stubdata/refsData.js';

const exampleSearchQueries = ['аромат', 'бескровный', 'белость', 'варити',
  'восплачевопльствити'];

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) log('CSL portal');

if (document.location.hostname === '$_CONFIG.CSL_IDN_REDIRECT') {
  document.location = 'https://$_CONFIG.CSL_IDN/';
}

const qs = window.URLSearchParams && (new URLSearchParams(document.location.search));
window[';)'] = {
  debug: qs && qs.has('debug') || false,
};

function getRandomElement(array) {
  let i = Math.floor(Math.random() * array.length);
  return array[i];
}

function getRandom(arrayToChooseFrom, N, excludeResults) {
  let array = [];
  while (array.length < N && array.length < arrayToChooseFrom.length) {
    let x = getRandomElement(arrayToChooseFrom);
    if (excludeResults.length + array.length < arrayToChooseFrom.length) {
      while (array.indexOf(x) >= 0 || excludeResults.indexOf(x) >= 0) {
        x = getRandomElement(arrayToChooseFrom);
      }
    } else {
      while (array.indexOf(x) >= 0) {
        x = getRandomElement(arrayToChooseFrom);
      }
    }
    array.push(x);
  }
  return array;
}

function getRandomItem(arrayToChooseFrom, excludeItem) {
  return getRandom(arrayToChooseFrom, 1, [excludeItem])[0];
}

function viewModel() {
  let self = this;

  this.debug = window[';)'].debug;
  this.section = ko.observable();
  this.indexIsOn = ko.observable(false);
  this.shouldSearchGrIx = ko.pureComputed(function () {
    const a = self.indexIsOn(),
          b = self.section() === 'dicionary';
    return a && b;
  });
  this.isMobileMenuHidden = ko.observable(true);
  this.videos = videos;
  this.randomVideos = ko.observableArray(getRandom(videos, 2, []));
  this.randomArticles = ko.observableArray(getRandom(articles, 2, []));
  this.randomRefs = ko.observableArray(getRandom(refs, 1, []));
  this.randomSearchQuery = ko.observable(getRandomItem(exampleSearchQueries));

  this.entryQuery = ko.observable();
  this.indexQuery = ko.observable();
  this.hints = ko.observableArray();
  this.article = ko.observable();

  this.hideMobileMenu = function () {
    self.isMobileMenuHidden(true);
    return true; // Propogate click events
  };
  this.toggleMobileMenu = function () {
    self.isMobileMenuHidden(!self.isMobileMenuHidden());
  };
  this.getRandomVideos = function () {
    self.randomVideos(getRandom(videos, 2, self.randomVideos()));
  };
  this.getRandomArticles = function () {
    self.randomArticles(getRandom(articles, 2, self.randomArticles()));
  };
  this.getRandomRefs = function () {
    self.randomRefs(getRandom(refs, 1, self.randomRefs()));
  };

  ko.computed(function () {
    const query = (self.entryQuery() || '')
      .toLowerCase()
      .replace(/ъ[иы]/g, 'ы')
      .replace(/[^а-щы-я]+/g, '')
      .replace(/^(бе|во|в|и|ни|ра|чре|чере)з([кпстфхцчшщ])/, '$1с$2');
    log('Query:', query);
    if (query) {
      searchEntries(query).then(self.hints, () => self.hints([]));
    } else {
      self.hints([]);
    }
  });
}
const vM = new viewModel();
initKnockout(ko, vM);

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) window.vM = vM;

// Настройка клиентской маршрутизации
const rootUrl = '/',
      dictionaryUrl = '$_CONFIG.urls.dictionary',
      entriesUrl = '$_CONFIG.urls.entries',
      particularEntryUrl = entriesUrl + '/:entryId',
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

function goRoot() {
  vM.section(null);
  vM.isMobileMenuHidden(true);
}
function goDictionary() {
  vM.section('dictionary');
  if (vM.indexIsOn()) {
    page.redirect(indexUrl);
  } else {
    page.redirect(entriesUrl);
  }
}
function goDictionaryAbout() {
}
function goEntries() {
  vM.section('dictionary');
  vM.indexIsOn(false);
}
function goIndex() {
  vM.section('dictionary');
  vM.indexIsOn(true);
}
function goVideos() {
  vM.section('video');
}
function goRefs() {
  // vM.section('refs');
}
function loadEntry(ctx, next) {
  const id = ctx.params.entryId;
  jQuery.ajax('/e/' + id, { dataType: 'text' }).then((text) => {
    vM.article(text);
    vM.entryQuery('');
  }, () => {
    log('can not load entry', id);
  });
  next();
}

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) log(debugURLs);

page(rootUrl, goRoot);
page(dictionaryUrl, goDictionary);
page(dictionaryAboutUrl, goDictionaryAbout);
page(entriesUrl, goEntries);
page(particularEntryUrl, loadEntry, goEntries);
page(indexUrl, goIndex);
page(videoUrl, goVideos);
page(refsUrl, goRefs);
//page(feedbackUrl, goFeedback);
page('*', rootUrl);
page({ hashbang: true });

jQuery('#safetyCurtain').fadeOut();
