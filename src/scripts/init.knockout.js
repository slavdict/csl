import jQuery from 'jquery';

export default function init(ko, viewModel) {
  ko.bindingHandlers.video = {
    init: function(element, valueAccessor) {
      let video = ko.unwrap(valueAccessor());
      jQuery(element).append(`

<lite-youtube videoid="${ video.id }" style="background-image:
  url('https://i.ytimg.com/vi/${ video.id }/hqdefault.jpg');">
</lite-youtube>
<figcaption>
  <header>${ video.title }</header>
  <div class="speaker">${ video.speaker }</div>
  <legend>${ video.legend }</legend>
</figcaption>

      `);
    }
  };
  ko.applyBindings(viewModel);
}
