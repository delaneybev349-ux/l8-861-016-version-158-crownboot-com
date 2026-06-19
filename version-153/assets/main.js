
(function () {
  function bySel(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    var searchForm = document.querySelector('[data-search-form]');
    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        renderSearch();
      });
      renderSearch();
    }
  });

  function normalize(text) {
    return String(text || '').trim().toLowerCase();
  }

  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function cardHtml(item) {
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="' + item.url + '">',
      '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
      '<span class="card-badge">' + escapeHtml(item.category) + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h3><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h3>',
      '<p>' + escapeHtml(item.oneLine) + '</p>',
      '<div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderSearch() {
    var data = window.movieIndex || [];
    var input = document.querySelector('[data-search-input]');
    var select = document.querySelector('[data-search-category]');
    var output = document.querySelector('[data-search-results]');
    var note = document.querySelector('[data-search-note]');
    if (!input || !select || !output) {
      return;
    }
    if (!input.value && getQueryParam('q')) {
      input.value = getQueryParam('q');
    }
    var q = normalize(input.value);
    var category = select.value;
    var results = data.filter(function (item) {
      var text = normalize(item.title + ' ' + item.oneLine + ' ' + item.region + ' ' + item.type + ' ' + item.genre + ' ' + item.category);
      var qMatch = !q || text.indexOf(q) !== -1;
      var cMatch = !category || item.category === category;
      return qMatch && cMatch;
    }).slice(0, 240);
    output.innerHTML = results.map(cardHtml).join('');
    if (note) {
      note.textContent = results.length ? '为你匹配到相关影片' : '没有找到匹配内容';
    }
  }
})();
