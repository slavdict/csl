import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';
import { searchEntries, searchGrix, searchGrixRev,
  cyrillicPreprocess, nonCyrillicPreprocess } from './scripts/searchEntries.js';

import { videos } from './scripts/videoData.js';
import { articles } from './scraps/stubdata/articlesData.js';
import { refs } from './scraps/stubdata/refsData.js';

const exampleSearchQueries = ['аромат', 'абие', 'бескровный', 'белость', 'варити',
  'восплачевопльствити'];
const exampleIxQueries = ['абие', 'вдохновение', 'воздаяти', 'вред', 'вода'];
const exampleIxQueriesGr = ['ἀνταποδίδωμι', 'γάμος', 'ὑλικός', 'χάρις'];
const exampleIxQueriesLa = ['ballo', 'makarios', 'thearestos', 'phthano'];

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
  this.aboutIsOn = ko.observable(false);
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
  this.randomIxQuery = ko.observable(getRandomItem(exampleIxQueries));
  this.randomIxQueryGr = ko.observable(getRandomItem(exampleIxQueriesGr));
  this.randomIxQueryLa = ko.observable(getRandomItem(exampleIxQueriesLa));

  this.randomSearchQuery.nextRandom = function () {
    let random = getRandomItem(exampleSearchQueries, self.randomSearchQuery());
    self.randomSearchQuery(random);
  };
  this.randomIxQuery.nextRandom = function () {
    let random = getRandomItem(exampleIxQueries, self.randomIxQuery());
    self.randomIxQuery(random);
  };
  this.randomIxQueryGr.nextRandom = function () {
    let random = getRandomItem(exampleIxQueriesGr, self.randomIxQueryGr());
    self.randomIxQueryGr(random);
  };
  this.randomIxQueryLa.nextRandom = function () {
    let random = getRandomItem(exampleIxQueriesLa, self.randomIxQueryLa());
    self.randomIxQueryLa(random);
  };

  this.entryQuery = ko.observable();
  this.indexQuery = ko.observable();
  this.hints = ko.observableArray();
  this.grixResults = ko.observableArray();
  this.article = ko.observable();
  this.searchTranslit = function () {
    let value = this.c ? this.c : this.t;
    self.indexQuery(value);
  };

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
    const query = cyrillicPreprocess((self.entryQuery() || '').toLowerCase());
    if (query) {
      searchEntries(query).then(self.hints, () => self.hints([]));
    } else {
      self.hints([]);
    }
  });

  ko.computed(function () {
    let query = (self.indexQuery() || '').toLowerCase(),
        searchFunc;
    if (query.search(/[а-я]/g) >= 0) {
      query = cyrillicPreprocess(query);
      searchFunc = searchGrix;
    } else {
      query = nonCyrillicPreprocess(query);
      searchFunc = searchGrixRev;
    }
    if (query) {
      searchFunc(query).then(self.grixResults, () => self.grixResults([]));
    } else {
      self.grixResults([]);
    }
  });

  self.aboutIsOn.loadData = ko.computed(function () {
    if (self.aboutIsOn()) {
      jQuery.ajax('/about.htm', { dataType: 'text' }).then(function (text) {
        jQuery('#about').append(text);
        self.aboutIsOn.loadData.dispose();
        delete self.aboutIsOn.loadData;
      }, function () {
        log('no about file');
      });
    }
  });

  self._refs = ko.computed(function () {
    if (self.section() === 'refs') {
      jQuery.ajax('/refs.htm', { dataType: 'text' }).then(function (text) {
        jQuery('#refs .main').append(text);
        self._refs.dispose();
        delete self._refs;
      }, function () {
        log('no refs file');
      });
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
  if (vM.aboutIsOn()) page.redirect(dictionaryAboutUrl);
  if (vM.indexIsOn()) page.redirect(indexUrl);
  page.redirect(entriesUrl);
}
function goDictionaryAbout() {
  vM.section('dictionary');
  vM.aboutIsOn(true);
}
function goEntries() {
  vM.section('dictionary');
  vM.indexIsOn(false);
  vM.aboutIsOn(false);
}
function goIndex() {
  vM.section('dictionary');
  vM.indexIsOn(true);
  vM.aboutIsOn(false);
}
function goVideos() {
  vM.section('video');
}
function goRefs(ctx) {
  vM.section('refs');
  const fragment = ctx.path.split('#').slice(1, 2);
  if (fragment.length === 1) {
    const elem = jQuery('#' + fragment[0]),
          header = jQuery('#header');
    if (elem.length > 0) {
      jQuery('body').animate({
        scrollTop: -header.offset().top + elem.offset().top,
      }, 2000);
    }
  }
}
function loadEntry(ctx, next) {
  const id = ctx.params.entryId;
  jQuery.ajax(`/e/${ id }.htm`, { dataType: 'text' }).then((text) => {
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
page(refsUrl + '*', goRefs);
//page(feedbackUrl, goFeedback);
page('*', rootUrl);
page({ hashbang: true });

jQuery('#safetyCurtain').fadeOut();
