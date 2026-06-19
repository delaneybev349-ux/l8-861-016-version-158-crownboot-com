(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
    if (slides.length > 1) {
      var current = 0;
      var show = function (index) {
        slides[current].classList.remove('is-active');
        if (dots[current]) {
          dots[current].classList.remove('is-active');
        }
        current = index;
        slides[current].classList.add('is-active');
        if (dots[current]) {
          dots[current].classList.add('is-active');
        }
      };
      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          show(index);
        });
      });
      setInterval(function () {
        show((current + 1) % slides.length);
      }, 5200);
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var input = document.querySelector('.js-filter-input');
    var yearSelect = document.querySelector('.js-filter-year');
    var regionSelect = document.querySelector('.js-filter-region');
    var empty = document.querySelector('.empty-state');

    if (cards.length && (input || yearSelect || regionSelect)) {
      var years = [];
      var regions = [];
      cards.forEach(function (card) {
        var year = card.getAttribute('data-year') || '';
        var region = card.getAttribute('data-region') || '';
        if (year && years.indexOf(year) === -1) {
          years.push(year);
        }
        if (region && regions.indexOf(region) === -1) {
          regions.push(region);
        }
      });
      years.sort().reverse().forEach(function (year) {
        if (yearSelect) {
          var option = document.createElement('option');
          option.value = year;
          option.textContent = year;
          yearSelect.appendChild(option);
        }
      });
      regions.sort().forEach(function (region) {
        if (regionSelect) {
          var option = document.createElement('option');
          option.value = region;
          option.textContent = region;
          regionSelect.appendChild(option);
        }
      });

      var apply = function () {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var yearValue = yearSelect ? yearSelect.value : '';
        var regionValue = regionSelect ? regionSelect.value : '';
        var visible = 0;
        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-type'),
            card.textContent
          ].join(' ').toLowerCase();
          var yearOk = !yearValue || card.getAttribute('data-year') === yearValue;
          var regionOk = !regionValue || card.getAttribute('data-region') === regionValue;
          var keywordOk = !keyword || text.indexOf(keyword) !== -1;
          var ok = yearOk && regionOk && keywordOk;
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.style.display = visible ? 'none' : 'block';
        }
      };

      if (input) {
        input.addEventListener('input', apply);
      }
      if (yearSelect) {
        yearSelect.addEventListener('change', apply);
      }
      if (regionSelect) {
        regionSelect.addEventListener('change', apply);
      }
    }
  });
})();
