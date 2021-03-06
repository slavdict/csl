import log from './scripts/log.js';

import jQuery from 'jquery';
import ko from 'knockout';
import page from 'page';

import initKnockout from './scripts/init.knockout.js';
import { searchEntries, searchGrix, searchGrixRev,
  cyrillicPreprocess, nonCyrillicPreprocess } from './scripts/searchEntries.js';
import { asyncGetAnnotation } from './scripts/loadAnnotations.js';
import { ResizeObserver } from '@juggle/resize-observer';

import { videos } from './scripts/videoData.js';
import { articles } from './scraps/stubdata/articlesData.js';
import { refs } from './scraps/stubdata/refsData.js';
import { filterCategories, allRefIds } from './scripts/filters.js';
import { rnc } from '../.temp/slavdict_generated/rnc.js';

const exampleSearchQueries = ['аромат', 'абие', 'бескровный', 'белость',
  'варити', 'восплачевопльствити'];
const exampleIxQueries = ['абие', 'вдохновение', 'воздаяти', 'вред', 'вода'];
const exampleIxQueriesGr = ['ἀνταποδίδωμι', 'γάμος', 'ὑλικός', 'χάρις'];
const exampleIxQueriesLa = ['ballo', 'makarios', 'thearestos', 'phthano'];

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) log('CSL portal');

if (document.location.hostname === '$_CONFIG.CSL_IDN_REDIRECT') {
  document.location = 'https://$_CONFIG.CSL_IDN/';
}

const qs = window.URLSearchParams
  && (new URLSearchParams(document.location.search));
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
  this.searchInProgress = ko.observable(false);
  this.hints = ko.observableArray();
  this.rnc = rnc;
  this.grixResults = ko.observableArray();
  this.article = ko.observable();

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
      self.searchInProgress(true);
      searchEntries(query)
        .then(self.hints, () => self.hints([]))
        .always(() => self.searchInProgress(false));
    } else {
      self.searchInProgress(false);
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
      self.searchInProgress(true);
      searchFunc(query)
        .then(self.grixResults, () => self.grixResults([]))
        .always(() => self.searchInProgress(false));
    } else {
      self.searchInProgress(false);
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

  self.filterCategories = filterCategories;
  self.refs = ko.observableArray([]);
  self.refIds = ko.computed(function () {
    let andList = self.filterCategories.map(category => {
      let refs = [];
      category.selectedFilters().forEach(
        filter => filter.index.forEach(
          ref => {
            if (refs.indexOf(ref) < 0) {
              refs.push(ref);
            }
          }
        )
      );
      return refs;
    });
    andList = andList.filter(x => x.length > 0);
    switch (andList.length) {
    case 0: return [];
    case 1: return andList[0];
    default: return andList.reduce((a, b) => {
      let intersection = [];
      a.forEach(x => b.indexOf(x) > -1 && intersection.push(x));
      return intersection;
    });
    }
  });
  self.noFilterChecked = ko.computed(function () {
    for (let category of self.filterCategories) {
      if (category.selectedFilters().length > 0) return false;
    }
    return true;
  });

  self._refsToLoad = [];
  self.getNextAnnotation = function () {
    let list = self._refsToLoad;
    if (list.length > 0) {
      asyncGetAnnotation(list[0]).then(ref => {
        self.refs.push(ref);
        self._refsToLoad = list.slice(1);
        self.getNextAnnotation();
      });
    }
  };
  self.getRandomRefsMain = function () {
    let lastRefIds = self.refs().map(ref => ref.id),
        refIds = getRandom(allRefIds, 5, lastRefIds);
    self.refs.removeAll();
    self._refsToLoad = refIds;
    self.getNextAnnotation();
  };
  ko.computed(function () {
    let refIds = self.refIds(),
        noFilterChecked = self.noFilterChecked();
    if (refIds.length === 0 && noFilterChecked) {
      refIds = getRandom(allRefIds, 5, []);
    }
    self.refs.removeAll();
    self._refsToLoad = refIds;
    self.getNextAnnotation();
  }).extend({ rateLimit: 500 });
}
const vM = new viewModel();
initKnockout(ko, vM);

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) window.vM = vM;

// Настройка клиентской маршрутизации
const rootUrl = '/',
      dictionaryUrl = '$_CONFIG.urls.dictionary',
      entriesUrl = '$_CONFIG.urls.entries',
      particularEntryUrl = entriesUrl + '/:entryId(\\d+)',
      findEntryUrl = entriesUrl + '/:query',
      indexUrl = '$_CONFIG.urls.index',
      findGreekUrl = indexUrl + '/:query',
      dictionaryAboutUrl = '$_CONFIG.urls.about',
      videoUrl = '$_CONFIG.urls.video',
      refsUrl = '$_CONFIG.urls.refs',
      authorsUrl = '$_CONFIG.urls.authors',
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
        authorsUrl,
      ];

function goRoot() {
  vM.section(null);
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
  vM.randomSearchQuery.nextRandom();
}
function goIndex(ctx) {
  vM.section('dictionary');
  vM.indexIsOn(true);
  vM.aboutIsOn(false);
  renewRandomGreek(ctx);
}
function goAuthors() {
  vM.section('authors');
  if (!vM._authorsLoaded) {
    jQuery.ajax('/authors.htm', { dataType: 'text' }).then(function (text) {
      jQuery('#authors').append(text);
      vM._authorsLoaded = true;
    }, function () {
      log('no authors file');
    });
  }
}
function goVideos() {
  vM.section('video');
  log('video');
}
function goRefs() {
  vM.section('refs');
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
function findEntry(ctx) {
  const query = ctx.params.query;
  vM.entryQuery(query);
  if (vM.section()) {
    vM.aboutIsOn(false);
    vM.indexIsOn(false);
    vM.section('dictionary');
  }
}
function findGreek(ctx, next) {
  const query = ctx.params.query;
  vM.indexQuery(query);
  next();
}
function pauseAllYtVideos() {
  const iframes = document.querySelectorAll('iframe'),
        message = JSON.stringify({ event: 'command', func: 'pauseVideo' });
  Array.prototype.forEach.call(iframes,
    iframe => iframe.contentWindow.postMessage(message, '*')
  );
}
function pauseVideos(ctx, next) {
  pauseAllYtVideos();
  next();
}
function hideMobileMenu(ctx, next) {
  vM.isMobileMenuHidden(true);
  next();
}
function renewRandomGreek(ctx) {
  if (ctx.params.query) {
    if (ctx.params.query.search(/[а-яА-Я]/) >= 0) {
      vM.randomIxQuery.nextRandom();
    } else if (ctx.params.query.search(/[a-zA-Z]/) >= 0) {
      vM.randomIxQueryLa.nextRandom();
    } else if (ctx.params.query.length > 0) {
      vM.randomIxQueryGr.nextRandom();
    }
  } else {
    vM.randomIxQuery.nextRandom();
    vM.randomIxQueryLa.nextRandom();
    vM.randomIxQueryGr.nextRandom();
  }
}

// eslint-disable-next-line no-undef
if (!$_CONFIG.CSL_ENV_IS_PRODUCTION) log(debugURLs);

page(rootUrl, hideMobileMenu, pauseVideos, goRoot);
page(dictionaryUrl, hideMobileMenu, pauseVideos, goDictionary);
page(dictionaryAboutUrl, hideMobileMenu, pauseVideos, goDictionaryAbout);
page(entriesUrl, pauseVideos, goEntries);
page(particularEntryUrl, pauseVideos, loadEntry, goEntries);
page(findEntryUrl, pauseVideos, findEntry);
page(indexUrl, pauseVideos, goIndex);
page(findGreekUrl, pauseVideos, findGreek, goIndex);
page(videoUrl, hideMobileMenu, pauseVideos, goVideos);
page(refsUrl + '*', hideMobileMenu, pauseVideos, goRefs);
page(authorsUrl, hideMobileMenu, pauseVideos, goAuthors);
page('*', rootUrl);
page({ hashbang: true });

/*
jQuery('#notifications .open').click(function () {
  jQuery('#notifications figcaption').slideUp();
  jQuery('#notifications article').slideDown();
});
jQuery('#notifications .close').click(function () {
  jQuery('#notifications figcaption').slideDown();
  jQuery('#notifications article').slideUp(function () {
    document.getElementById('header').scrollIntoView();
  });
});
*/

function hoverBehaviour(isPoinerDevice) {
  // Если это тач-устройство, не делаем ничего.
  if (!isPoinerDevice) return;

  // Если это не тач-устройство, а устройство с указателем, который может
  // зависать над элементами страницы, то настраиваем полосу прокрутки.
  function modifyScroller() {
    let scroller = document.getElementById('scroller'),
        body = document.body,
        scrollTop = body.scrollTop,
        scrollHeight = body.scrollHeight,
        windowHeight = body.clientHeight,
        height, scrollerTop;
    if (scrollHeight <= windowHeight) {
      //scroller.style.display = 'none';
      scroller.style.top = '0px';
      scroller.style.height = '0px';
    } else {
      //scroller.style.display = 'block';
      height = windowHeight * windowHeight / scrollHeight;
      scrollerTop = scrollTop + scrollTop / scrollHeight * windowHeight;
      if (height < 5) {
        height = 5;
        scrollerTop = scrollHeight - 5;
      }
      scroller.style.top = String(scrollerTop) + 'px';
      scroller.style.height = String(height) + 'px';
    }
  }

  let grabScroller = null;

  function grab(event) {
    event.preventDefault();
    if (grabScroller === null) {
      holdOff(event);
      return;
    }
    let y = event.clientY - grabScroller,
        body = document.body,
        scrollHeight = body.scrollHeight,
        windowHeight = body.clientHeight,
        scrollTop = y / windowHeight * scrollHeight;
    body.scrollTop = scrollTop;
  }

  function holdOff(event) {
    event.preventDefault();
    let scroller = document.getElementById('scroller');
    window.removeEventListener('pointermove', grab, true);
    window.removeEventListener('pointerup', holdOff, true);
    scroller.classList.remove('grabed');
    grabScroller = null;
  }

  function holdOn(event) {
    console.log('grab', event);
    event.preventDefault();
    let scroller = document.getElementById('scroller');
    window.addEventListener('pointermove', grab, true);
    window.addEventListener('pointerup', holdOff, true);
    scroller.classList.add('grabed');
    grabScroller = event.offsetY;
  }

  window.addEventListener('resize', modifyScroller);
  document.body.addEventListener('scroll', modifyScroller);
  let ro = new ResizeObserver(modifyScroller);
  ro.observe(document.getElementById('main'));
  document.getElementById('scroller').addEventListener('pointerdown', holdOn);

}

let mediaQueryList = window.matchMedia('(hover: hover)');
hoverBehaviour(mediaQueryList.matches);

jQuery('#safetyCurtain').fadeOut();
