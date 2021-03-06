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
    .replace(/^(бе|во|в|и|ни|ра|чре|чере)з([кпстфхцчшщ])/g, '$1с$2');
  return text;
}

const transliterations = [
    [/[\u0300-\u0313\u0315-\u036f]/g, ''], /* удаляем диакритику
                                              кроме густого придыхания */
    [/^\u03c1\u0314?/g, 'rh'], // ро в начале слова или с густым придыханием
    [/\u03c1\u03c1\u0314?/g, 'rrh'], // двойное ро в середине слова
    [/(.+)\u0314/g, 'h$1'], // густое придыхание переводим в h
    [/\u03b1/g, 'a'],
    [/\u03b2/g, 'b'],
    [/\u03b3/g, 'g'],
    [/\u03b4/g, 'd'],
    [/\u03b5/g, 'e'],
    [/\u03b6/g, 'z'],
    [/\u03b7/g, 'e'],
    [/\u03b8/g, 'th'],
    [/\u03b9/g, 'i'],
    [/\u03ba/g, 'k'],
    [/\u03bb/g, 'l'],
    [/\u03bc/g, 'm'],
    [/\u03bd/g, 'n'],
    [/\u03be/g, 'x'],
    [/\u03bf/g, 'o'],
    [/\u03c0/g, 'p'],
    [/\u03c1/g, 'r'],
    [/[\u03c2\u03c3]/g, 's'],
    [/\u03c4/g, 't'],
    [/\u03c5/g, 'y'],
    [/\u03c6/g, 'ph'],
    [/\u03c7/g, 'ch'],
    [/\u03c8/g, 'ps'],
    [/\u03c9/g, 'o'],

    [/[^a-zA-Z]/g, ''],

    [/g([gkxc])/g, 'n$1'],
    [/([aeo])y/g, '$1u'],
    [/yi/g, 'ui'],
];

function nonCyrillicPreprocess(text) {
  // greek
  text = text.normalize('NFD');
  for (let [src, dst] of transliterations) {
    text = text.replace(src, dst);
  }
  // latin
  text = text.replace(/rh/g, 'r').replace(/ph/g, 'f');
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
