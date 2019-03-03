import jQuery from 'jquery';

const index = {},
      indexUrl = '/xp/',
      rootNode = '_ix',
      KEY_HINTS = 'h',
      KEY_INDEX = 'i',
      KEY_POSTFIX = 'p';

function nodeConvert(nodename) {
  let s = '';
  for (let char of nodename) {
    s += char.charCodeAt(0).toString(36);
  }
  return s;
}

function searchInNode(nodename, query) {
  var deferred,
      value = { nodename: nodename, query: query };
  if (!index[nodename]) {
    deferred = jQuery.getJSON(indexUrl + nodeConvert(nodename) + '.json').then(
      function (data) {
        index[nodename] = data;
        value.ix = data;
        return value;
      }
    );
  } else {
    deferred = jQuery.Deferred();
    value.ix = index[nodename];
    deferred.resolve(value);
    deferred = deferred.promise();
  }
  return deferred;
}

function onNodeSuccess(value) {
  const query = value.query,
        nodename = value.nodename,
        isRootNode = nodename === rootNode,
        n = isRootNode ? 0 : nodename.length,
        char = query.slice(n, n + 1),
        ix = value.ix[KEY_INDEX],
        hints = value.ix[KEY_HINTS],
        postfix = value.ix[KEY_POSTFIX],
        NOHINTS = [];

  if (ix) {
    if (query === nodename && !isRootNode) return hints;
    else if (query.startsWith(nodename) || isRootNode) {
      if (ix.indexOf(char) >= 0) {
        const sproutNode = query.slice(0, n + 1);
        return searchInNode(sproutNode, query).then(onNodeSuccess);
      } else return NOHINTS;
    } else {
      return NOHINTS;
    }
  }

  if (postfix) {
    if ((nodename + postfix).startsWith(query)) return hints;
    else return NOHINTS;
  }

  return hints || [];
}

function searchEntries(query) {
  return searchInNode(rootNode, query).then(onNodeSuccess);
}

export { searchEntries };
