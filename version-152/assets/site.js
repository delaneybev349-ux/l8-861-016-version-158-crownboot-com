(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot')) || 0;
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  var filterInput = document.getElementById('categoryFilter');
  var typeFilter = document.getElementById('typeFilter');
  var filterGrid = document.querySelector('[data-filter-grid]');

  function applyFilters() {
    if (!filterGrid) {
      return;
    }
    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var typeValue = typeFilter ? typeFilter.value.trim().toLowerCase() : '';
    var cards = Array.prototype.slice.call(filterGrid.querySelectorAll('[data-movie-card]'));

    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-search') || '').toLowerCase();
      var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchesType = !typeValue || haystack.indexOf(typeValue) !== -1;
      card.hidden = !(matchesKeyword && matchesType);
    });
  }

  if (filterInput) {
    filterInput.addEventListener('input', applyFilters);
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }
})();
