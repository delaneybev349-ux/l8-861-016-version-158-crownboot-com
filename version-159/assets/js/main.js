(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("hidden");
      });
    }

    var searchForms = document.querySelectorAll("[data-global-search]");
    searchForms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[name='q']");
        var value = input ? input.value.trim() : "";
        var base = form.getAttribute("data-base") || "all.html";
        window.location.href = value ? base + "?q=" + encodeURIComponent(value) : base;
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;
      var show = function (index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      };
      var start = function () {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      };
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });
      show(0);
      start();
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    var movieList = document.querySelector("[data-movie-list]");
    if (filterPanel && movieList) {
      var searchInput = filterPanel.querySelector("[data-filter-search]");
      var yearSelect = filterPanel.querySelector("[data-filter-year]");
      var typeSelect = filterPanel.querySelector("[data-filter-type]");
      var items = Array.prototype.slice.call(movieList.querySelectorAll(".movie-item"));
      var emptyState = document.querySelector("[data-empty-state]");
      var params = new URLSearchParams(window.location.search);
      if (searchInput && params.get("q")) {
        searchInput.value = params.get("q");
      }
      var filter = function () {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        var visible = 0;
        items.forEach(function (item) {
          var haystack = [
            item.getAttribute("data-title"),
            item.getAttribute("data-year"),
            item.getAttribute("data-type"),
            item.getAttribute("data-region"),
            item.getAttribute("data-genre"),
            item.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var ok = true;
          if (query && haystack.indexOf(query) === -1) {
            ok = false;
          }
          if (year && item.getAttribute("data-year") !== year) {
            ok = false;
          }
          if (type && item.getAttribute("data-type") !== type) {
            ok = false;
          }
          item.classList.toggle("hidden", !ok);
          if (ok) {
            visible += 1;
          }
        });
        if (emptyState) {
          emptyState.classList.toggle("hidden", visible !== 0);
        }
      };
      [searchInput, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", filter);
          control.addEventListener("change", filter);
        }
      });
      filter();
    }
  });
})();
