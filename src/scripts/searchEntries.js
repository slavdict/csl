import jQuery from 'jquery';

const indices = {
        entries: { ix: {}, url: '/xp/' },
        grix: { ix: {}, url: '/xg/' },
        grixRev: { ix: {}, url: '/xgr/' },
      },
      rootNode = '_ix',
      KEY_HINTS = 'h',
      KEY_INDEX = 'i',
      KEY_GREEK_RESULTS = 'r',
      KEY_POSTFIX = 'p';

function cyrillicPreprocess(text) {
  text = text.replace(/ъ[иы]/g, 'ы')
    .replace(/[^а-щы-я]+/g, '')
    .replace(/^(бе|во|в|и|ни|ра|чре|чере)з([кпстфхцчшщ])/, '$1с$2');
  return text;
}

function nonCyrillicPreprocess(text) {
  return text;
}

function nodeConvert(nodename) {
  let s = '';
  for (let char of nodename) {
    s += char.charCodeAt(0).toString(36);
  }
  return s;
}

function searchInNode(index, indexUrl, nodename, query) {
  var deferred,
      value = { nodename: nodename, query: query, url: indexUrl };
  if (!index[nodename]) {
    let path = indexUrl + nodeConvert(nodename) + '.json';
    deferred = jQuery.getJSON(path).then(data => {
      index[nodename] = data;
      value.ix = data;
      return value;
    });
  } else {
    deferred = jQuery.Deferred();
    value.ix = index[nodename];
    deferred.resolve(value);
    deferred = deferred.promise();
  }
  return deferred;
}

function onNodeSuccess(keyname) {
  return function (value) {
    const query = value.query,
          nodename = value.nodename,
          isRootNode = nodename === rootNode,
          n = isRootNode ? 0 : nodename.length,
          char = query.slice(n, n + 1),
          ix = value.ix[KEY_INDEX],
          results = value.ix[keyname],
          postfix = value.ix[KEY_POSTFIX],
          NORESULTS = [];

    if (ix) {
      if (query === nodename && !isRootNode) return results;
      else if (query.startsWith(nodename) || isRootNode) {
        if (ix.indexOf(char) >= 0) {
          const sproutNode = query.slice(0, n + 1);
          return searchInNode(value.ix, value.url, sproutNode, query)
            .then(onNodeSuccess(keyname));
        } else return NORESULTS;
      } else {
        return NORESULTS;
      }
    }

    if (postfix) {
      if ((nodename + postfix).startsWith(query)) return results;
      else return NORESULTS;
    }

    return results || [];
  };
}

function searchEntries(query) {
  return searchInNode(indices['entries'].ix, indices['entries'].url,
    rootNode, query).then(onNodeSuccess(KEY_HINTS));
}

function searchGrix(query) {
  return searchInNode(indices['grix'].ix, indices['grix'].url, rootNode, query)
    .then(onNodeSuccess(KEY_GREEK_RESULTS));
}

function searchGrixRev(query) {
  return searchInNode(indices['grixRev'].ix, indices['grixRev'].url,
    rootNode, query).then(onNodeSuccess(KEY_GREEK_RESULTS));
}

export { searchEntries, searchGrix, searchGrixRev,
  cyrillicPreprocess, nonCyrillicPreprocess };
