export default function init(ko, viewModel) {
  ko.bindingHandlers.video = {
    init: function(element, valueAccessor) {
      const video = ko.unwrap(valueAccessor());
      element.innerHTML = `

<lite-youtube videoid="${ video.id }"></lite-youtube>
<figcaption>
  <header>${ video.title }</header>
  <div class="speaker">${ video.speaker }</div>
  <legend>${ video.legend }</legend>
</figcaption>

      `;
    }
  };
  ko.applyBindings(viewModel);
}
