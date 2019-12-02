import jQuery from 'jquery';

const annotationsUrl = '/a/';

var annotationsRegister = {};

class Annotation {
  constructor(id, data) {
    this.id = id;
    this.title = this.getTitle(data);
    this.videoTitle = data.videoTitle;
    this.bib = this.getBib(data);
    this.url = data.url;
    this.youtubeId = data.youtubeId;
    this.createDate = new Date(data.createDate);
    this.teaser = data.teaser;
    this.annotation = data.annotation;
  }
  getTitle(data) {
    if (!data.title) return undefined;
    if (data.youtubeId) {
      return `<a href="https://youtu.be/${ data.youtubeId }" target="_blank">${
        data.title }</a>`;
    }
    if (data.url) {
      return `<a href="${ data.url }" target="_blank">${ data.title }</a>`;
    } else {
      return data.title;
    }
  }
  getBib(data) {
    if (!data.bib) return undefined;
    if (data.title) return data.bib;
    if (data.url) {
      return `<a href="${ data.url }" target="_blank">${ data.bib }</a>`;
    } else {
      return data.bib;
    }
  }
}

function asyncGetAnnotation(id) {
  var deferred;
  if (!annotationsRegister[id]) {
    let path = annotationsUrl + String(id) + '.json';
    deferred = jQuery.getJSON(path).then(data => {
      let annotation = new Annotation(id, data);
      annotationsRegister[id] = annotation;
      return annotation;
    });
  } else {
    deferred = jQuery.Deferred();
    deferred.resolve(annotationsRegister[id]);
    deferred = deferred.promise();
  }
  return deferred;
}

export { asyncGetAnnotation };
