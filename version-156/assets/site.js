(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var menuButton = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (menuButton && panel) {
            menuButton.addEventListener("click", function () {
                panel.classList.toggle("is-open");
            });
        }

        var searchForms = document.querySelectorAll("[data-search-form]");
        searchForms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input");
                var value = input ? input.value.trim() : "";
                var target = "search.html";
                if (value) {
                    target += "?q=" + encodeURIComponent(value);
                }
                window.location.href = target;
            });
        });

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (slides.length) {
            var active = 0;
            var timer = null;
            var show = function (index) {
                active = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("is-active", i === active);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("is-active", i === active);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    show(i);
                    restart();
                });
            });
            var restart = function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function () {
                    show(active + 1);
                }, 5400);
            };
            show(0);
            restart();
        }

        var filterRoot = document.querySelector("[data-filter-root]");
        if (filterRoot) {
            var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
            var keyword = document.querySelector("[data-filter-keyword]");
            var region = document.querySelector("[data-filter-region]");
            var type = document.querySelector("[data-filter-type]");
            var year = document.querySelector("[data-filter-year]");
            var empty = document.querySelector("[data-empty-state]");
            var params = new URLSearchParams(window.location.search);
            var initial = params.get("q");
            if (keyword && initial) {
                keyword.value = initial;
            }
            var apply = function () {
                var q = keyword ? keyword.value.trim().toLowerCase() : "";
                var r = region ? region.value : "";
                var t = type ? type.value : "";
                var y = year ? year.value : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var hay = (card.getAttribute("data-search") || "").toLowerCase();
                    var ok = true;
                    if (q && hay.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (r && card.getAttribute("data-region") !== r) {
                        ok = false;
                    }
                    if (t && card.getAttribute("data-type") !== t) {
                        ok = false;
                    }
                    if (y && card.getAttribute("data-year") !== y) {
                        ok = false;
                    }
                    card.style.display = ok ? "flex" : "none";
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            };
            [keyword, region, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        }
    });
})();
