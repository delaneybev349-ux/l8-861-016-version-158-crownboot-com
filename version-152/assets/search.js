(function () {
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var summary = document.getElementById('searchSummary');
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var items = window.SEARCH_ITEMS || [];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[match];
    });
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function card(item) {
    return '<article class="movie-card">' +
      '<a class="movie-cover" href="' + escapeHtml(item.url) + '">' +
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="cover-badge">' + escapeHtml(item.region) + '</span>' +
      '<span class="cover-play">▶</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
      '<p>' + escapeHtml(item.summary) + '</p>' +
      '<div class="movie-meta">' +
      '<span>' + escapeHtml(item.year) + '</span>' +
      '<span>' + escapeHtml(item.type) + '</span>' +
      '<span>' + escapeHtml(item.genre) + '</span>' +
      '</div>' +
      '</div>' +
      '</article>';
  }

  function render(query) {
    var normalizedQuery = normalize(query);
    var matches = items.filter(function (item) {
      if (!normalizedQuery) {
        return true;
      }
      var haystack = normalize([
        item.title,
        item.year,
        item.region,
        item.type,
        item.genre,
        item.summary,
        (item.tags || []).join(' ')
      ].join(' '));
      return haystack.indexOf(normalizedQuery) !== -1;
    }).slice(0, 120);

    if (summary) {
      summary.textContent = normalizedQuery ? '搜索结果' : '精选影片';
    }

    if (results) {
      results.innerHTML = matches.map(card).join('');
    }
  }

  if (input) {
    input.value = initialQuery;
    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  render(initialQuery);
})();
